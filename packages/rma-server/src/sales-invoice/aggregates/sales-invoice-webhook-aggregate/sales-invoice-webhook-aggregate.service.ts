import { Injectable } from '@nestjs/common';
import { from, of } from 'rxjs';
import { switchMap, mergeMap, toArray } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { PURCHASE_INVOICE_ALREADY_EXIST } from '../../../constants/messages';
import {
  SUBMITTED_STATUS,
  CANCELED_STATUS,
} from '../../../constants/app-strings';
import { SalesInvoiceService } from '../../entity/sales-invoice/sales-invoice.service';
import { SalesInvoice } from '../../entity/sales-invoice/sales-invoice.entity';
import {
  SalesInvoiceWebhookDto,
  SalesInvoiceWebhookItemDto,
} from '../../entity/sales-invoice/sales-invoice-webhook-dto';
import { ItemService } from '../../../item/entity/item/item.service';

@Injectable()
export class SalesInvoiceWebhookAggregateService {
  constructor(
    private readonly salesInvoiceService: SalesInvoiceService,
    private readonly itemService: ItemService,
  ) {}

  salesInvoiceCreated(salesInvoicePayload: SalesInvoiceWebhookDto) {
    return from(
      this.salesInvoiceService.findOne({
        name: salesInvoicePayload.name,
      }),
    ).pipe(
      switchMap(salesInvoice => {
        if (salesInvoice) {
          this.salesInvoiceService
            .updateOne(
              { name: salesInvoicePayload.name },
              {
                $set: {
                  address_display: salesInvoicePayload.address_display,
                },
              },
            )
            .then(success => {})
            .catch(error => {});
          return of({ message: PURCHASE_INVOICE_ALREADY_EXIST });
        }
        return this.mapPurchaseInvoice(salesInvoicePayload).pipe(
          switchMap(provider => {
            this.salesInvoiceService
              .create(provider)
              .then(success => {})
              .catch(error => {});
            return of({});
          }),
        );
      }),
    );
  }

  mapPurchaseInvoice(salesInvoicePayload: SalesInvoiceWebhookDto) {
    return this.getSerializedItem(salesInvoicePayload.items).pipe(
      switchMap(serializedItems => {
        const salesInvoice = new SalesInvoice();
        Object.assign(salesInvoice, salesInvoicePayload);
        salesInvoice.created_on = new Date();
        salesInvoice.uuid = uuidv4();
        salesInvoice.isSynced = true;
        salesInvoice.status = SUBMITTED_STATUS;
        salesInvoice.inQueue = false;
        salesInvoice.submitted = true;
        salesInvoice.items = serializedItems;
        return of(salesInvoice);
      }),
    );
  }

  getSerializedItem(items: SalesInvoiceWebhookItemDto[]) {
    return from(items).pipe(
      mergeMap(item => {
        return from(
          this.itemService.findOne({ item_code: item.item_code }),
        ).pipe(
          switchMap(response => {
            item.has_serial_no = response.has_serial_no;
            return of(item);
          }),
        );
      }),
      toArray(),
    );
  }

  salesInvoiceCanceled(canceledInvoice: { name: string }) {
    return this.salesInvoiceService.updateOne(
      { name: canceledInvoice.name },
      {
        $set: {
          isSynced: true,
          status: CANCELED_STATUS,
          inQueue: false,
          submitted: true,
        },
      },
    );
  }
}
