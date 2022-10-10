import {
  BadRequestException,
  HttpService,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { ItemService } from '../../entity/item/item.service';
import { MinimumItemPriceSetEvent } from '../../events/minimum-item-price-set/minimum-item-price-set.event';
import { WarrantyMonthsSetEvent } from '../../events/purchase-warranty-days-set/purchase-warranty-days-set.event';
import { SetWarrantyMonthsDto } from '../../entity/item/set-warranty-months-dto';
import { ITEM_NOT_FOUND } from '../../../constants/messages';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import {
  bufferCount,
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap,
  toArray,
} from 'rxjs/operators';
import { Item } from '../../entity/item/item.entity';
import {
  INVALID_FILE,
  AUTHORIZATION,
  BEARER_HEADER_VALUE_PREFIX,
  ITEM_SYNC_BUFFER_COUNT,
} from '../../../constants/app-strings';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { FRAPPE_API_GET_ITEM_ENDPOINT } from '../../../constants/routes';

@Injectable()
export class ItemAggregateService extends AggregateRoot {
  constructor(
    private readonly itemService: ItemService,
    private readonly http: HttpService,
    private readonly settingService: ServerSettingsService,
  ) {
    super();
  }

  async retrieveItem(uuid: string, req) {
    const item = await this.itemService.findOne({ uuid });
    if (!item) throw new NotFoundException();
    return item;
  }

  async updateItemHasSerialNo(has_serial_no: number, item_name: string) {
    const item = await this.itemService.findOne({ item_name });
    if (!item) {
      throw new NotFoundException(ITEM_NOT_FOUND);
    } else {
      return await this.itemService.updateOne(
        { item_name },
        { $set: { has_serial_no } },
      );
    }
  }

  async getItemList(offset, limit, sort, filterQuery, clientHttpRequest) {
    return this.itemService.list(offset, limit, sort, filterQuery);
  }

  async getBrandList() {
    return this.itemService.distinct();
  }

  async setMinPrice(uuid: string, minimumPrice: number) {
    const item = await this.itemService.findOne({ uuid });
    item.minimumPrice = minimumPrice;
    this.apply(new MinimumItemPriceSetEvent(item));
  }

  async setWarrantyMonths(uuid: string, updatePayload: SetWarrantyMonthsDto) {
    const item = await this.itemService.findOne({ uuid });
    if (!item) {
      throw new NotFoundException(ITEM_NOT_FOUND);
    }
    this.apply(new WarrantyMonthsSetEvent(updatePayload, uuid));
  }

  async retrieveItemByCode(code: string, req) {
    const item = await this.itemService.findOne({ item_code: code });
    if (!item) throw new NotFoundException();
    return item;
  }

  async retrieveItemByNames(items_names: string[], req) {
    const item = await this.itemService.find({
      item_name: { $in: items_names },
    });
    if (!item) throw new NotFoundException();
    return item;
  }

  async set_item_mrp(uuid: string, mrp: string) {
    return await this.itemService.updateOne({ uuid }, { $set: { mrp } });
  }

  getBundleItems(item_codes): Observable<any[]> {
    return from(
      this.itemService.find({ item_code: { $in: Object.keys(item_codes) } }),
    ).pipe(
      switchMap(itemList => {
        const items = {};
        itemList.forEach(singleItem => {
          if (!singleItem.bundle_items) {
            if (items[singleItem.item_code]) {
              items[singleItem.item_code].qty +=
                item_codes[singleItem.item_code];
            } else {
              items[singleItem.item_code] = singleItem;
              items[singleItem.item_code].qty =
                item_codes[singleItem.item_code];
            }
            return;
          }

          singleItem.bundle_items.forEach(item => {
            if (items[item.item_code]) {
              items[item.item_code].qty +=
                item.qty * item_codes[singleItem.item_code];
              return;
            }
            items[item.item_code] = item;
            items[item.item_code].qty =
              item.qty * item_codes[singleItem.item_code];
          });
        });
        return of([...Object.values(items)]);
      }),
    );
  }

  syncItems(file, req) {
    return from(this.getJsonData(file)).pipe(
      switchMap((data: Item[]) => {
        if (!data) {
          return throwError(new BadRequestException(INVALID_FILE));
        }
        return forkJoin({
          settings: this.settingService.find(),
          data: of(data),
        });
      }),
      switchMap(({ settings, data }) => {
        return from(data).pipe(
          bufferCount(ITEM_SYNC_BUFFER_COUNT),
          concatMap(items => {
            return this.batchSyncFrappeItems(items, settings, req);
          }),
          toArray(),
          switchMap(() => of(true)),
        );
      }),
    );
  }

  batchSyncFrappeItems(data: Item[], settings, req) {
    return from(data).pipe(
      mergeMap(item => {
        return of({}).pipe(
          switchMap(() => {
            return this.http.get(
              `${settings.authServerURL}${FRAPPE_API_GET_ITEM_ENDPOINT}${item.item_code}`,
              {
                headers: {
                  [AUTHORIZATION]:
                    BEARER_HEADER_VALUE_PREFIX + req.token.accessToken,
                },
              },
            );
          }),
          map(data => data.data.data),
          switchMap((item: Item) => {
            delete item.has_serial_no;
            return from(
              this.itemService.updateOne(
                { item_code: item.item_code },
                { $set: item },
              ),
            );
          }),
          catchError(err => {
            if (
              err?.response?.statusText === 'NOT FOUND' ||
              err?.response?.data?._server_messages?.includes('not found')
            ) {
              return from(
                this.itemService.deleteOne({ item_code: item.item_code }),
              );
            }
            return throwError(
              new BadRequestException(
                `Error in fetching item: ${item.item_name}.`,
              ),
            );
          }),
        );
      }),
      toArray(),
      switchMap(() => of(true)),
    );
  }

  getJsonData(file) {
    return of(JSON.parse(file.buffer));
  }
}
