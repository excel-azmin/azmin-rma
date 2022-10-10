import { Injectable, HttpService } from '@nestjs/common';
import {
  PurchaseInvoiceWebhookDto,
  PurchaseInvoiceItemDto,
} from '../../entity/purchase-invoice/purchase-invoice-webhook-dto';
import { PurchaseInvoiceService } from '../../entity/purchase-invoice/purchase-invoice.service';
import { PurchaseInvoice } from '../../entity/purchase-invoice/purchase-invoice.entity';
import { from, of, forkJoin, Observable } from 'rxjs';
import { switchMap, map, toArray, mergeMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { PURCHASE_INVOICE_ALREADY_EXIST } from '../../../constants/messages';
import {
  SUBMITTED_STATUS,
  CANCELED_STATUS,
} from '../../../constants/app-strings';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { FRAPPE_API_GET_USER_INFO_ENDPOINT } from '../../../constants/routes';
import { DateTime } from 'luxon';
import { ItemService } from '../../../item/entity/item/item.service';
import { PurchaseOrder } from '../../../purchase-order/entity/purchase-order/purchase-order.entity';
import { PurchaseOrderService } from '../../../purchase-order/entity/purchase-order/purchase-order.service';
@Injectable()
export class PurchaseInvoiceWebhookAggregateService {
  constructor(
    private readonly purchaseInvoiceService: PurchaseInvoiceService,
    private readonly clientToken: ClientTokenManagerService,
    private readonly settings: SettingsService,
    private readonly http: HttpService,
    private readonly itemService: ItemService,
    private readonly purchaseOrderService: PurchaseOrderService,
  ) {}

  purchaseInvoiceCreated(purchaseInvoicePayload: PurchaseInvoiceWebhookDto) {
    return forkJoin({
      purchaseInvoice: from(
        this.purchaseInvoiceService.findOne({
          name: purchaseInvoicePayload.name,
        }),
      ),
      settings: this.settings.find(),
    }).pipe(
      switchMap(({ purchaseInvoice, settings }) => {
        if (purchaseInvoice) {
          return of({ message: PURCHASE_INVOICE_ALREADY_EXIST });
        }
        return this.mapPurchaseInvoice(purchaseInvoicePayload).pipe(
          switchMap((provider: PurchaseInvoice) => {
            provider.created_on = new DateTime(settings.timeZone).toJSDate();
            return this.getUserDetails(purchaseInvoicePayload.owner).pipe(
              switchMap(user => {
                provider.created_by = user.full_name;
                return from(
                  this.purchaseOrderService.findOne({
                    purchase_invoice_name: purchaseInvoicePayload.name,
                  }),
                ).pipe(
                  switchMap((purchaseOrder: PurchaseOrder) => {
                    provider.posting_date = purchaseOrder.transaction_date;
                    return from(this.purchaseInvoiceService.create(provider));
                  }),
                );
              }),
            );
          }),
        );
      }),
    );
  }

  mapPurchaseInvoice(
    purchaseInvoicePayload: PurchaseInvoiceWebhookDto,
  ): Observable<PurchaseInvoice> {
    return this.getSerializedItem(purchaseInvoicePayload.items).pipe(
      switchMap(serializedItems => {
        const purchaseInvoice = new PurchaseInvoice();
        Object.assign(purchaseInvoice, purchaseInvoicePayload);
        purchaseInvoice.uuid = uuidv4();
        purchaseInvoice.isSynced = true;
        purchaseInvoice.status = SUBMITTED_STATUS;
        purchaseInvoice.inQueue = false;
        purchaseInvoice.submitted = true;
        purchaseInvoice.items = serializedItems;
        return of(purchaseInvoice);
      }),
    );
  }

  getSerializedItem(items: PurchaseInvoiceItemDto[]) {
    return from(items).pipe(
      mergeMap(item => {
        return from(
          this.itemService.findOne({ item_code: item.item_code }),
        ).pipe(
          switchMap(response => {
            item.has_serial_no = response ? response.has_serial_no : undefined;
            return of(item);
          }),
        );
      }),
      toArray(),
    );
  }

  getUserDetails(email: string) {
    return forkJoin({
      headers: this.clientToken.getServiceAccountApiHeaders(),
      settings: this.settings.find(),
    }).pipe(
      switchMap(({ headers, settings }) => {
        return this.http
          .get(
            settings.authServerURL + FRAPPE_API_GET_USER_INFO_ENDPOINT + email,
            { headers },
          )
          .pipe(map(res => res.data.data));
      }),
    );
  }

  cancelPurchaseInvoice(name: string) {
    return from(this.purchaseInvoiceService.findOne({ name })).pipe(
      switchMap(invoice => {
        if (!invoice) return of({ purchaseInvoiceNotFound: true });
        return from(
          this.purchaseInvoiceService.updateOne(
            { uuid: invoice.uuid },
            {
              $set: {
                docstatus: 2,
                status: CANCELED_STATUS,
                submitted: false,
              },
            },
          ),
        );
      }),
    );
  }
}
