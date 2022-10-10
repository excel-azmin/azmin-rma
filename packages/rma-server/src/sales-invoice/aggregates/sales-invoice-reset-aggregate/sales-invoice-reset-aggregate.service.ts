import { Injectable, BadRequestException, HttpService } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { SalesInvoiceService } from '../../entity/sales-invoice/sales-invoice.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { catchError, concatMap, map, switchMap, toArray } from 'rxjs/operators';
import { throwError, from, of, forkJoin, Observable } from 'rxjs';
import { SalesInvoiceResetPoliciesService } from '../../policies/sales-invoice-reset-policies/sales-invoice-reset-policies.service';
import {
  FRAPPE_CLIENT_CANCEL,
  GET_FRAPPE_LINKED_DOCS_ENDPOINT,
} from '../../../constants/routes';
import {
  DOC_NAMES,
  AUTHORIZATION,
  BEARER_HEADER_VALUE_PREFIX,
  DOC_RESET_INFO,
  SALES_INVOICE_STATUS,
  DELIVERY_NOTE_DOCTYPE,
} from '../../../constants/app-strings';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { SalesInvoice } from '../../entity/sales-invoice/sales-invoice.entity';
import { DocInfoInterface } from '../../../purchase-order/policies/purchase-order-policies/purchase-order-policies.service';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { StockLedger } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.entity';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
@Injectable()
export class SalesInvoiceResetAggregateService extends AggregateRoot {
  constructor(
    private readonly salesInvoiceService: SalesInvoiceService,
    private readonly settingsService: SettingsService,
    private readonly http: HttpService,
    private readonly serialNoHistoryService: SerialNoHistoryService,
    private readonly salesResetPolicies: SalesInvoiceResetPoliciesService,
    private readonly serialNoService: SerialNoService,
    private readonly stockLedgerService: StockLedgerService,
  ) {
    super();
  }

  cancel(uuid: string, req) {
    let serverSettings;
    return from(this.salesInvoiceService.findOne({ uuid })).pipe(
      switchMap(salesInvoice => {
        if (!salesInvoice) {
          return throwError(new BadRequestException('Sales Invoice not found'));
        }
        return this.salesResetPolicies.validateSalesInvoiceReset(salesInvoice);
      }),
      switchMap(salesInvoice => {
        return this.settingsService.find().pipe(
          switchMap(settings => {
            serverSettings = settings;
            return this.cancelERPNextSalesInvoice(salesInvoice, settings, req);
          }),
          switchMap(success => {
            return this.cancelERPNextDocs(
              { [DOC_NAMES.SALES_INVOICE]: [salesInvoice.name] },
              req,
              serverSettings,
            );
          }),
          switchMap(success => of(salesInvoice)),
        );
      }),
      switchMap(salesInvoice => {
        return this.getSalesInvoiceSerials(salesInvoice).pipe(
          switchMap((data: { serials: string[] }) => {
            if (!data || !data.serials) {
              return of(true);
            }
            return this.resetSalesInvoiceSerialState(
              salesInvoice,
              data.serials,
            );
          }),
          switchMap(success => of(salesInvoice)),
        );
      }),
      switchMap(salesInvoice => {
        return from(
          this.salesInvoiceService.updateOne(
            { name: salesInvoice.name },
            {
              $set: {
                docstatus: 2,
                status: SALES_INVOICE_STATUS.canceled,
              },
            },
          ),
        ).pipe(
          switchMap(() => {
            return of(salesInvoice);
          }),
        );
      }),
      switchMap((salesInvoice: SalesInvoice) => {
        if (
          salesInvoice.delivery_note_items.length &&
          !salesInvoice.returned_items.length
        ) {
          return from(salesInvoice.delivery_note_items).pipe(
            concatMap(item => {
              return this.createStockLedgerPayload(
                {
                  warehouse: salesInvoice.delivery_warehouse,
                  deliveryNoteItem: item,
                },
                req.token,
                serverSettings,
              ).pipe(
                switchMap((response: StockLedger) => {
                  return from(this.stockLedgerService.create(response));
                }),
              );
            }),
            toArray(),
          );
        }
        return of(true);
      }),
    );
  }

  createStockLedgerPayload(
    payload: { warehouse: string; deliveryNoteItem },
    token,
    settings: ServerSettings,
  ) {
    return this.settingsService.getFiscalYear(settings).pipe(
      switchMap(fiscalYear => {
        const date = new DateTime(settings.timeZone).toJSDate();
        const stockPayload = new StockLedger();
        stockPayload.name = uuidv4();
        stockPayload.modified = date;
        stockPayload.modified_by = token.email;
        stockPayload.warehouse = payload.warehouse;
        stockPayload.item_code = payload.deliveryNoteItem.item_code;
        stockPayload.actual_qty = payload.deliveryNoteItem.qty;
        stockPayload.valuation_rate = payload.deliveryNoteItem.rate;
        stockPayload.batch_no = '';
        stockPayload.posting_date = date;
        stockPayload.posting_time = date;
        stockPayload.voucher_type = DELIVERY_NOTE_DOCTYPE;
        stockPayload.voucher_no =
          payload.deliveryNoteItem.against_sales_invoice;
        stockPayload.voucher_detail_no = '';
        stockPayload.incoming_rate = 0;
        stockPayload.outgoing_rate = 0;
        stockPayload.qty_after_transaction = stockPayload.actual_qty;
        stockPayload.stock_value =
          stockPayload.qty_after_transaction * stockPayload.valuation_rate;
        stockPayload.stock_value_difference =
          stockPayload.actual_qty * stockPayload.valuation_rate;
        stockPayload.company = settings.defaultCompany;
        stockPayload.fiscal_year = fiscalYear;
        return of(stockPayload);
      }),
    );
  }

  resetSalesInvoiceSerialState(salesInvoice: SalesInvoice, serials: string[]) {
    return forkJoin({
      resetSerialHistory: from(
        this.serialNoHistoryService.deleteMany({
          parent_document: salesInvoice.name,
        }),
      ),
      resetSerialState: from(
        this.serialNoService.updateMany(
          {
            serial_no: { $in: serials },
          },
          {
            $unset: {
              customer: undefined,
              'warranty.salesWarrantyDate': undefined,
              'warranty.soldOn': undefined,
              delivery_note: undefined,
              sales_invoice_name: undefined,
              sales_return_name: undefined,
            },
          },
        ),
      ),
    }).pipe(switchMap(success => this.setSerialWarehouseState(serials)));
  }

  getSalesInvoiceSerials(salesInvoice) {
    const returned_serials = [];
    salesInvoice.returned_items?.forEach(item =>
      item.serial_no
        ? returned_serials.push(...item.serial_no.split('\n'))
        : null,
    );
    return this.serialNoService
      .asyncAggregate([
        {
          $match: {
            $or: [
              { sales_invoice_name: salesInvoice.name },
              { serial_no: { $in: returned_serials } },
            ],
          },
        },
        {
          $group: {
            _id: 1,
            serials: {
              $push: '$serial_no',
            },
          },
        },
      ])
      .pipe(map((data: any) => (data?.length ? data[0] : undefined)));
  }

  setSerialWarehouseState(serials: string[]) {
    if (!serials?.length) {
      return of(true);
    }
    return this.serialNoHistoryService
      .asyncAggregate([
        {
          $match: {
            serial_no: {
              $in: serials,
            },
          },
        },
        {
          $group: {
            _id: '$serial_no',
            warehouse: {
              $last: '$$ROOT.transaction_to',
            },
          },
        },
        {
          $group: {
            _id: '$warehouse',
            serials: {
              $push: '$_id',
            },
          },
        },
      ])
      .pipe(
        switchMap((data: { _id: string; serials: string[] }[]) => {
          if (!data?.length) {
            return of(true);
          }
          return from(data).pipe(
            switchMap(serialData => {
              return from(
                this.serialNoService.updateMany(
                  {
                    serial_no: { $in: serialData.serials },
                  },
                  { $set: { warehouse: serialData._id } },
                ),
              );
            }),
            toArray(),
          );
        }),
        switchMap(success => of(true)),
      );
  }

  cancelERPNextSalesInvoice(salesInvoice: SalesInvoice, settings, req) {
    return this.getERPNextLinkedDocs(
      DOC_NAMES.SALES_INVOICE,
      salesInvoice.name,
      DOC_RESET_INFO[DOC_NAMES.SALES_INVOICE],
      settings,
      req,
    ).pipe(
      switchMap(docs => {
        return of({
          [DOC_NAMES.SALES_INVOICE]: docs.message[DOC_NAMES.SALES_INVOICE]
            ? docs.message[DOC_NAMES.SALES_INVOICE]
                .filter(data => data.docstatus !== 2)
                .map(data => data.name)
            : [],
          [DOC_NAMES.DELIVERY_NOTE]: docs.message[DOC_NAMES.DELIVERY_NOTE]
            ? docs.message[DOC_NAMES.DELIVERY_NOTE]
                .filter(data => data.docstatus !== 2)
                .map(data => data.name)
            : [],
        });
      }),
      switchMap(data => {
        return this.cancelERPNextDocs(data, req, settings);
      }),
    );
  }

  cancelERPNextDocs(docs: { [key: string]: string[] }, req, settings) {
    return of({}).pipe(
      switchMap(obj => {
        return from(Object.keys(docs)).pipe(
          concatMap((docType: string) => {
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
            return throwError(err);
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

  getERPNextLinkedDocs(
    docTypeName,
    docName,
    docInfo,
    settings: ServerSettings,
    clienthttpReq,
  ): Observable<{ message: { [key: string]: DocInfoInterface[] } }> {
    return this.http
      .post(
        settings.authServerURL + GET_FRAPPE_LINKED_DOCS_ENDPOINT,
        {
          doctype: docTypeName,
          name: docName,
          linkinfo: docInfo,
        },
        {
          headers: {
            [AUTHORIZATION]:
              BEARER_HEADER_VALUE_PREFIX + clienthttpReq.token.accessToken,
          },
        },
      )
      .pipe(map(data => data.data));
  }
}
