import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { PurchaseOrderPoliciesService } from '../../policies/purchase-order-policies/purchase-order-policies.service';
import { PurchaseOrderService } from '../../entity/purchase-order/purchase-order.service';
import { catchError, concatMap, switchMap, toArray } from 'rxjs/operators';
import { forkJoin, from, of, throwError } from 'rxjs';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { PurchaseOrder } from '../../entity/purchase-order/purchase-order.entity';
import { PurchaseInvoiceService } from '../../../purchase-invoice/entity/purchase-invoice/purchase-invoice.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { FRAPPE_CLIENT_CANCEL } from '../../../constants/routes';
import {
  DOC_NAMES,
  PURCHASE_RECEIPT_DOCTYPE_NAME,
} from '../../../constants/app-strings';
import {
  AUTHORIZATION,
  PURCHASE_INVOICE_STATUS,
  BEARER_HEADER_VALUE_PREFIX,
} from '../../../constants/app-strings';
import { PurchaseReceiptService } from '../../../purchase-receipt/entity/purchase-receipt.service';
import { StockLedger } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.entity';
import { PurchaseOrderItemDto } from '../../../purchase-order/entity/purchase-order/purchase-order-webhook-dto';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';

@Injectable()
export class PurchaseOrderAggregateService extends AggregateRoot {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService,
    private readonly purchaseOrderPolicy: PurchaseOrderPoliciesService,
    private readonly serialHistoryService: SerialNoHistoryService,
    private readonly serialNoService: SerialNoService,
    private readonly purchaseInvoiceService: PurchaseInvoiceService,
    private readonly serverSettings: SettingsService,
    private readonly http: HttpService,
    private readonly purchaseReceiptService: PurchaseReceiptService,
    private readonly stockLedgerService: StockLedgerService,
  ) {
    super();
  }

  async retrievePurchaseOrder(params) {
    return await this.purchaseOrderService.findOne(params);
  }

  getPurchaseOrderList(
    offset: number,
    limit: number,
    sort: string,
    filter_query: any,
  ) {
    return this.purchaseOrderService.list(offset, limit, sort, filter_query);
  }

  resetOrder(name: string, req) {
    return this.serverSettings.find().pipe(
      switchMap(settings => {
        return this.purchaseOrderPolicy
          .validatePurchaseOrderReset(name, settings, req)
          .pipe(
            switchMap((docs: { [key: string]: string[] }) => {
              return this.cancelERPNextDocs(docs, req, settings);
            }),
            switchMap(success => {
              return this.cancelERPNextDocs(
                { [DOC_NAMES.PURCHASE_INVOICE]: [name] },
                req,
                settings,
              );
            }),
            switchMap(success => {
              return this.purchaseOrderService.findOne({
                purchase_invoice_name: name,
              });
            }),
            switchMap((purchaseOrder: PurchaseOrder) => {
              return forkJoin({
                resetSerials: from(
                  this.serialNoService.deleteMany({
                    purchase_invoice_name: purchaseOrder.purchase_invoice_name,
                  }),
                ),
                resetSerialHistory: from(
                  this.serialHistoryService.deleteMany({
                    parent_document: purchaseOrder.purchase_invoice_name,
                  }),
                ),
                updatePurchaseOrder: from(
                  this.purchaseOrderService.updateOne(
                    { name: purchaseOrder.name },
                    {
                      $set: {
                        docstatus: 2,
                        status: PURCHASE_INVOICE_STATUS.CANCELED,
                      },
                    },
                  ),
                ),
                updatePurchaseInvoice: from(
                  this.purchaseInvoiceService.updateOne(
                    { name },
                    {
                      $set: {
                        docstatus: 2,
                        status: PURCHASE_INVOICE_STATUS.CANCELED,
                      },
                    },
                  ),
                ),
                updatePurchaseReceipt: from(
                  this.purchaseReceiptService.updateMany(
                    {
                      purchase_invoice_name:
                        purchaseOrder.purchase_invoice_name,
                    },
                    {
                      $set: {
                        docstatus: 2,
                        status: PURCHASE_INVOICE_STATUS.CANCELED,
                      },
                    },
                  ),
                ),
                purchaseOrderReset: this.createPurchaseResetLedger(
                  purchaseOrder,
                  req.token,
                  settings,
                ),
              });
            }),
            switchMap(success => of(true)),
          );
      }),
    );
  }

  createPurchaseResetLedger(
    purchaseOrder: PurchaseOrder,
    token,
    settings: ServerSettings,
  ) {
    return from(purchaseOrder.items).pipe(
      concatMap((item: PurchaseOrderItemDto) => {
        return this.createStockLedgerPayload(
          {
            pr_no: purchaseOrder.purchase_invoice_name,
            purchaseReciept: item,
          },
          token,
          settings,
        ).pipe(
          switchMap((stockLedgerPayload: StockLedger) => {
            return from(this.stockLedgerService.create(stockLedgerPayload));
          }),
        );
      }),
      toArray(),
    );
  }

  getDeliveredQuantity(purchase_invoice_name: string, item_code: string) {
    return from(
      this.purchaseReceiptService.find({ purchase_invoice_name, item_code }),
    ).pipe(
      switchMap(purchaseReciept => {
        if (purchaseReciept.length) {
          return of(purchaseReciept.find(x => x).qty);
        }
        return of(0);
      }),
    );
  }

  createStockLedgerPayload(
    payload: { pr_no: string; purchaseReciept: PurchaseOrderItemDto },
    token,
    settings: ServerSettings,
  ) {
    return forkJoin({
      purchaseDelvieredQty: this.getDeliveredQuantity(
        payload.pr_no,
        payload.purchaseReciept.item_code,
      ),
      fiscalYear: this.serverSettings.getFiscalYear(settings),
    }).pipe(
      switchMap(delieverdState => {
        payload.purchaseReciept.qty = delieverdState.purchaseDelvieredQty;
        const date = new DateTime(settings.timeZone).toJSDate();
        const stockPayload = new StockLedger();
        stockPayload.name = uuidv4();
        stockPayload.modified = date;
        stockPayload.modified_by = token.email;
        stockPayload.warehouse = payload.purchaseReciept.warehouse;
        stockPayload.item_code = payload.purchaseReciept.item_code;
        stockPayload.actual_qty = -payload.purchaseReciept.qty;
        stockPayload.valuation_rate = payload.purchaseReciept.rate;
        stockPayload.batch_no = '';
        stockPayload.stock_uom = payload.purchaseReciept.stock_uom;
        stockPayload.posting_date = date;
        stockPayload.posting_time = date;
        stockPayload.voucher_type = PURCHASE_RECEIPT_DOCTYPE_NAME;
        stockPayload.voucher_no = payload.pr_no;
        stockPayload.voucher_detail_no = '';
        stockPayload.incoming_rate = payload.purchaseReciept.rate;
        stockPayload.outgoing_rate = 0;
        stockPayload.qty_after_transaction = stockPayload.actual_qty;
        stockPayload.stock_value =
          stockPayload.qty_after_transaction * stockPayload.valuation_rate;
        stockPayload.stock_value_difference =
          stockPayload.actual_qty * stockPayload.valuation_rate;
        stockPayload.company = settings.defaultCompany;
        stockPayload.fiscal_year = delieverdState.fiscalYear;
        return of(stockPayload);
      }),
    );
  }

  cancelERPNextDocs(docs: { [key: string]: string[] }, req, settings) {
    return of({}).pipe(
      switchMap(obj => {
        return from(Object.keys(docs)).pipe(
          concatMap((docType: string) => {
            if (!docs[docType]?.length) {
              return of(true);
            }
            return from(docs[docType]).pipe(
              concatMap(doc => {
                return this.cancelDoc(docType, doc, settings, req);
              }),
              switchMap(success => of(true)),
            );
          }),
          catchError(err => {
            if (
              err?.response?.data?.exc &&
              err?.response?.data?.exc.includes(
                'Cannot edit cancelled document',
              )
            ) {
              return of(true);
            }
            return throwError(
              new BadRequestException(err?.response?.data?.exc),
            );
          }),
        );
      }),
      toArray(),
    );
  }

  cancelDoc(doctype, docName, settings: ServerSettings, req) {
    const doc = {
      doctype,
      name: docName,
    };
    return this.http.post(settings.authServerURL + FRAPPE_CLIENT_CANCEL, doc, {
      headers: {
        [AUTHORIZATION]: BEARER_HEADER_VALUE_PREFIX + req.token.accessToken,
      },
    });
  }
}
