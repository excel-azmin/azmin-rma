import {
  Injectable,
  BadRequestException,
  NotImplementedException,
  HttpService,
} from '@nestjs/common';
import {
  DeliveryNoteWebhookDto,
  DeliveryNoteItemsDto,
  DeliveryNoteTaxesDto,
} from '../../../delivery-note/entity/delivery-note-service/delivery-note-webhook.dto';
import { DeliveryNoteService } from '../../../delivery-note/entity/delivery-note-service/delivery-note.service';
import { from, throwError } from 'rxjs';
import { switchMap, map, retry } from 'rxjs/operators';
import { DeliveryNote } from '../../../delivery-note/entity/delivery-note-service/delivery-note.entity';
import { v4 as uuidv4 } from 'uuid';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { LIST_DELIVERY_NOTE_ENDPOINT } from '../../../constants/routes';
import { DELIVERY_NOTE_ALREADY_EXISTS } from '../../../constants/messages';
@Injectable()
export class DeliveryNoteWebhookAggregateService {
  constructor(
    private readonly deliveryNoteService: DeliveryNoteService,
    private readonly settingsService: SettingsService,
    private readonly clientTokenManager: ClientTokenManagerService,
    private readonly http: HttpService,
  ) {}

  createdDeliveryNote(deliveryNotePayload: DeliveryNoteWebhookDto) {
    return from(
      this.deliveryNoteService.findOne({ name: deliveryNotePayload.name }),
    ).pipe(
      switchMap(deliveryNote => {
        if (deliveryNote) {
          return throwError(
            new BadRequestException(DELIVERY_NOTE_ALREADY_EXISTS),
          );
        }
        const provider = this.mapDeliveryNote(deliveryNotePayload);
        provider.uuid = uuidv4();
        provider.isSynced = false;
        this.deliveryNoteService.create(provider);
        return this.syncDeliveryNote(provider);
      }),
    );
  }
  mapDeliveryNote(deliveryNotePayload: DeliveryNoteWebhookDto) {
    const deliveryNote = new DeliveryNote();
    Object.assign(deliveryNote, deliveryNotePayload);
    return deliveryNote;
  }
  syncDeliveryNote(deliveryNotePayload: DeliveryNoteWebhookDto) {
    return this.settingsService.find().pipe(
      switchMap(settings => {
        if (!settings.authServerURL) {
          return throwError(new NotImplementedException());
        }
        return this.clientTokenManager.getServiceAccountApiHeaders().pipe(
          switchMap(headers => {
            const url =
              settings.authServerURL +
              LIST_DELIVERY_NOTE_ENDPOINT +
              deliveryNotePayload.name;
            return this.http.get(url, { headers }).pipe(
              map(res => res.data.data),
              switchMap(response => {
                const deliveryNoteItems = this.mapDeliveryNoteItems(
                  response.items,
                );
                const deliveryNoteTaxes = this.mapDeliveryNoteTaxes(
                  response.taxes,
                );
                return from(
                  this.deliveryNoteService.updateOne(
                    { name: deliveryNotePayload.name },
                    {
                      $set: {
                        items: deliveryNoteItems,
                        taxes: deliveryNoteTaxes,
                        isSynced: true,
                      },
                    },
                  ),
                );
              }),
            );
          }),
          retry(3),
        );
      }),
    );
  }
  mapDeliveryNoteItems(deliveryNoteItems: DeliveryNoteItemsDto[]) {
    const sanitizedData = [];
    deliveryNoteItems.forEach(eachDeliveryNoteItem => {
      sanitizedData.push({
        name: eachDeliveryNoteItem.name,
        item_code: eachDeliveryNoteItem.item_code,
        item_name: eachDeliveryNoteItem.item_name,
        description: eachDeliveryNoteItem.description,
        is_nil_exempt: eachDeliveryNoteItem.is_nil_exempt,
        is_non_gst: eachDeliveryNoteItem.is_non_gst,
        item_group: eachDeliveryNoteItem.item_group,
        image: eachDeliveryNoteItem.image,
        qty: eachDeliveryNoteItem.qty,
        conversion_factor: eachDeliveryNoteItem.conversion_factor,
        stock_qty: eachDeliveryNoteItem.stock_qty,
        price_list_rate: eachDeliveryNoteItem.price_list_rate,
        base_price_list_rate: eachDeliveryNoteItem.base_price_list_rate,
        rate: eachDeliveryNoteItem.rate,
        amount: eachDeliveryNoteItem.amount,
      });
    });
    return sanitizedData;
  }

  mapDeliveryNoteTaxes(deliveryNoteTaxes: DeliveryNoteTaxesDto[]) {
    const sanitizedData = [];
    deliveryNoteTaxes.forEach(eachDeliveryNoteTax => {
      sanitizedData.push({
        name: eachDeliveryNoteTax.name,
        docstatus: eachDeliveryNoteTax.docstatus,
        charge_type: eachDeliveryNoteTax.charge_type,
        account_head: eachDeliveryNoteTax.account_head,
        description: eachDeliveryNoteTax.description,
        cost_center: eachDeliveryNoteTax.cost_center,
        rate: eachDeliveryNoteTax.rate,
        tax_amount: eachDeliveryNoteTax.tax_amount,
        total: eachDeliveryNoteTax.total,
      });
    });
    return sanitizedData;
  }
}
