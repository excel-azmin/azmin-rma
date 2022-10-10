import { AggregateRoot } from '@nestjs/cqrs';
import {
  Injectable,
  HttpService,
  BadRequestException,
  NotImplementedException,
} from '@nestjs/common';
import {
  ItemWebhookInterface,
  ItemApiResponseInterface,
  ItemBundleWebhookInterface,
} from '../../entity/item/item-webhook-interface';
import { ItemService } from '../../entity/item/item.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { from, throwError, of } from 'rxjs';
import { switchMap, map, retry } from 'rxjs/operators';
import {
  CUSTOMER_ALREADY_EXISTS,
  ITEM_METADATA_FILTER_FIELDS,
} from '../../../constants/app-strings';
import { Item } from '../../entity/item/item.entity';
import { v4 as uuidv4 } from 'uuid';
import { FRAPPE_API_GET_ITEM_ENDPOINT } from '../../../constants/routes';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';

@Injectable()
export class ItemWebhookAggregateService extends AggregateRoot {
  constructor(
    private readonly itemService: ItemService,
    private readonly clientTokenManager: ClientTokenManagerService,
    private readonly http: HttpService,
    private readonly settingsService: SettingsService,
    private readonly errorLogService: ErrorLogService,
  ) {
    super();
  }

  itemCreated(itemPayload: ItemWebhookInterface) {
    return from(
      this.itemService.findOne({ item_code: itemPayload.item_code }),
    ).pipe(
      switchMap(item => {
        if (item) {
          return throwError(new BadRequestException(CUSTOMER_ALREADY_EXISTS));
        }
        const provider = this.mapItem(itemPayload);
        this.itemService
          .create(provider)
          .then(success => {})
          .catch(error => {});
        this.syncItemMetadata(provider);
        return of({});
      }),
    );
  }

  bundleUpdated(bundlePayload: ItemBundleWebhookInterface) {
    const code = [];
    bundlePayload.items.forEach(item => code.push(item.item_code));
    return from(this.itemService.find({ item_code: { $in: code } })).pipe(
      switchMap(itemList => {
        const hash = {};
        itemList.forEach(item => {
          hash[item.item_code] = item;
        });
        return of(hash);
      }),
      switchMap(hash => {
        const items = [];
        bundlePayload.items.forEach(item => {
          Object.assign(hash[item.item_code], item);
          items.push(hash[item.item_code]);
        });
        return of(items);
      }),
      switchMap(bundleItems => {
        return from(
          this.itemService.updateOne(
            { item_code: bundlePayload.new_item_code },
            {
              $set: {
                bundle_items: bundleItems,
              },
            },
          ),
        );
      }),
    );
  }

  mapItem(itemPayload: ItemWebhookInterface) {
    const item = new Item();
    Object.assign(item, itemPayload);
    item.uuid = uuidv4();
    item.isSynced = false;
    return item;
  }

  syncItemMetadata(item: Item) {
    return this.settingsService
      .find()
      .pipe(
        switchMap(settings => {
          if (!settings.authServerURL) {
            return throwError(new NotImplementedException());
          }
          return this.clientTokenManager.getServiceAccountApiHeaders().pipe(
            switchMap(headers => {
              return this.http
                .get(
                  settings.authServerURL +
                    FRAPPE_API_GET_ITEM_ENDPOINT +
                    item.item_code,
                  { headers },
                )
                .pipe(
                  map(data => data.data.data),
                  switchMap((response: ItemApiResponseInterface) => {
                    const itemMetadata = this.mapItemMetadata(response);
                    this.itemService
                      .updateOne(
                        { uuid: item.uuid },
                        {
                          $set: {
                            taxes: itemMetadata.taxes,
                            attributes: itemMetadata.attributes,
                            uoms: itemMetadata.uoms,
                            item_defaults: itemMetadata.item_defaults,
                            isSynced: true,
                          },
                        },
                      )
                      .then(success => {})
                      .catch(err => {});
                    return of({});
                  }),
                );
            }),
            retry(3),
          );
        }),
      )
      .subscribe({
        next: success => {},
        error: err => {
          this.errorLogService.createErrorLog(err, 'Item', 'webhook', {});
        },
      });
  }

  mapItemMetadata(item: ItemApiResponseInterface) {
    const filteredItem = {
      taxes: [],
      attributes: [],
      uoms: [],
      item_defaults: [],
    };
    filteredItem.taxes = this.filterItemFields(item.taxes);
    filteredItem.attributes = this.filterItemFields(item.attributes);
    filteredItem.uoms = this.filterItemFields(item.uoms);
    filteredItem.item_defaults = this.filterItemFields(item.item_defaults);
    return filteredItem;
  }

  filterItemFields(fieldArray: any[]) {
    fieldArray.forEach(eachArrayField => {
      ITEM_METADATA_FILTER_FIELDS.forEach(element => {
        delete eachArrayField[element];
      });
    });
    return fieldArray;
  }

  itemDeleted(item: ItemWebhookInterface) {
    return from(this.itemService.deleteOne({ item_code: item.item_code }));
  }

  itemUpdated(itemPayload: ItemWebhookInterface) {
    return from(
      this.itemService.findOne({ item_code: itemPayload.item_code }),
    ).pipe(
      switchMap(item => {
        if (!item) {
          this.itemCreated(itemPayload).subscribe({
            next: success => {},
            error: err => {},
          });
          return of();
        }
        itemPayload.isSynced = true;
        delete itemPayload.has_serial_no;
        this.itemService
          .updateOne({ uuid: item.uuid }, { $set: itemPayload })
          .then(success => {})
          .catch(err => {});
        this.syncItemMetadata(item);
        return of();
      }),
    );
  }
}
