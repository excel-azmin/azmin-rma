import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { PurchaseInvoiceService } from '../../../purchase-invoice/entity/purchase-invoice/purchase-invoice.service';
import { from, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  BEARER_HEADER_VALUE_PREFIX,
  PURCHASE_INVOICE_STATUS,
} from '../../../constants/app-strings';
import { PurchaseInvoice } from '../../../purchase-invoice/entity/purchase-invoice/purchase-invoice.entity';
import { PurchaseOrderService } from '../../entity/purchase-order/purchase-order.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { DOC_NAMES, DOC_RESET_INFO } from '../../../constants/app-strings';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import {
  AUTHORIZATION,
  HUNDRED_NUMBER_STRING,
} from '../../../constants/app-strings';
import { GET_FRAPPE_LINKED_DOCS_ENDPOINT } from '../../../constants/routes';
import { LANDED_COST_VOUCHER_ENDPOINT } from '../../../constants/routes';

@Injectable()
export class PurchaseOrderPoliciesService {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService,
    private readonly purchaseInvoiceService: PurchaseInvoiceService,
    private readonly serialNoService: SerialNoService,
    private readonly http: HttpService,
  ) {}

  validatePurchaseOrderReset(
    name: string,
    settings: ServerSettings,
    clientHttpReq,
  ) {
    return this.validatePurchaseInvoice(name).pipe(
      switchMap(invoice => {
        return this.validatePurchaseSerials(invoice);
      }),
      switchMap(invoice => {
        return this.validateSerialState(invoice);
      }),
      switchMap(invoice => {
        return this.validateERPNextDocuments(invoice, settings, clientHttpReq);
      }),
    );
  }

  validatePurchaseInvoice(name) {
    return from(this.purchaseInvoiceService.findOne({ name })).pipe(
      switchMap(invoice => {
        if (!invoice) {
          return throwError(
            new BadRequestException('Purchase Invoice Not found'),
          );
        }
        if ([PURCHASE_INVOICE_STATUS.CANCELED].includes(invoice.status)) {
          return throwError(
            new BadRequestException(
              `Purchase Invoice with status ${invoice.status} cannot be reseted.`,
            ),
          );
        }
        return from(
          this.purchaseOrderService.findOne({ purchase_invoice_name: name }),
        ).pipe(
          switchMap(order => {
            if (!order) {
              return throwError(
                new BadRequestException('Purchase Order Not found'),
              );
            }
            if (order.docstatus === 2) {
              return throwError(
                new BadRequestException(
                  `Canceled Purchase order cannot be reseted.`,
                ),
              );
            }
            return of(invoice);
          }),
        );
      }),
    );
  }

  validateSerialState(invoice: PurchaseInvoice) {
    return from(
      this.serialNoService.count({
        purchase_invoice_name: invoice.name,
        queue_state: { $gt: {} },
      }),
    ).pipe(
      switchMap(count => {
        if (count) {
          return throwError(
            new BadRequestException(
              `Found ${count} serials to be already in queue, please reset queue to proceed.`,
            ),
          );
        }
        return of(invoice);
      }),
    );
  }

  validatePurchaseSerials(invoice: PurchaseInvoice) {
    return this.serialNoService
      .asyncAggregate([
        {
          $match: {
            purchase_invoice_name: invoice.name,
          },
        },
        {
          $project: {
            _id: 1,
            serial_no: 1,
          },
        },
        {
          $lookup: {
            from: 'serial_no_history',
            localField: 'serial_no',
            foreignField: 'serial_no',
            as: 'history',
          },
        },
        { $unwind: '$history' },
        {
          $group: {
            _id: '$serial_no',
            historyEvents: { $sum: 1 },
          },
        },
        {
          $redact: {
            $cond: {
              if: {
                $gt: ['$historyEvents', 1],
              },
              then: '$$KEEP',
              else: '$$PRUNE',
            },
          },
        },
      ])
      .pipe(
        switchMap((data: { _id: string; historyEvents: number }[]) => {
          if (data?.length) {
            const serialEventsMessage = data
              .splice(0, 50)
              .filter(element => `${element._id} has ${element.historyEvents}`)
              .join(', ');
            return throwError(
              new BadRequestException(
                `Found ${data.length} Serials having multiple events : 
          ${serialEventsMessage}..`,
              ),
            );
          }
          return of(invoice);
        }),
      );
  }

  validateERPNextDocuments(
    invoice: PurchaseInvoice,
    settings: ServerSettings,
    clientHttpReq,
  ) {
    let order;
    return this.getERPNextLinkedDocs(
      DOC_NAMES.PURCHASE_INVOICE,
      invoice.name,
      DOC_RESET_INFO[DOC_NAMES.PURCHASE_INVOICE],
      settings,
      clientHttpReq,
    ).pipe(
      switchMap((docs: { message: { [key: string]: DocInfoInterface[] } }) => {
        if (docs?.message && Object.keys(docs.message).length) {
          if (this.validateDocCanceled(docs.message[DOC_NAMES.PAYMENT_ENTRY])) {
            return of(true);
          }
          return throwError(
            new BadRequestException(
              `Found Linked Documents for ${DOC_NAMES.PURCHASE_INVOICE}, in ${
                DOC_NAMES.PAYMENT_ENTRY
              }
              ${docs.message[DOC_NAMES.PAYMENT_ENTRY]
                .map(data => {
                  return data.name;
                })
                .join(', ')}`,
            ),
          );
        }
        return of(true);
      }),
      switchMap(valid => {
        return from(
          this.purchaseOrderService.findOne({
            purchase_invoice_name: invoice.name,
          }),
        );
      }),
      switchMap(purchaseOrder => {
        order = purchaseOrder;
        return this.getERPNextLinkedDocs(
          DOC_NAMES.PURCHASE_ORDER,
          purchaseOrder.name,
          DOC_RESET_INFO[DOC_NAMES.PURCHASE_ORDER],
          settings,
          clientHttpReq,
        );
      }),
      switchMap((docs: { message: { [key: string]: DocInfoInterface[] } }) => {
        return of({
          [DOC_NAMES.PURCHASE_RECEIPT]: docs.message[DOC_NAMES.PURCHASE_RECEIPT]
            ? docs.message[DOC_NAMES.PURCHASE_RECEIPT]
                .filter(data => data.docstatus !== 2)
                .map(data => data.name)
            : [],
          [DOC_NAMES.PURCHASE_INVOICE]: docs.message[DOC_NAMES.PURCHASE_INVOICE]
            ? docs.message[DOC_NAMES.PURCHASE_INVOICE]
                .filter(data => data.docstatus !== 2)
                .map(data => data.name)
            : [],
          [DOC_NAMES.PURCHASE_ORDER]: order.docstatus === 2 ? [] : [order.name],
        });
      }),
      switchMap(data => {
        if (
          data[DOC_NAMES.PURCHASE_RECEIPT] &&
          data[DOC_NAMES.PURCHASE_RECEIPT].length
        ) {
          return this.validatePurchaseReceipts(
            data[DOC_NAMES.PURCHASE_RECEIPT],
            settings,
            clientHttpReq,
          ).pipe(switchMap(success => of(data)));
        }
        return of(data);
      }),
    );
  }

  validateDocCanceled(data: { docstatus: number }[]) {
    let valid = true;
    data.forEach(element => {
      if (element.docstatus !== 2) {
        valid = false;
      }
      return;
    });
    return valid;
  }

  validatePurchaseReceipts(
    docNames: string[],
    settings: ServerSettings,
    clientHttpReq,
  ) {
    const params = {
      fields: JSON.stringify(['name', 'docstatus']),
      filters: JSON.stringify([['receipt_document', 'in', docNames]]),
      limit_page_length: HUNDRED_NUMBER_STRING,
    };
    return this.http
      .get(settings.authServerURL + LANDED_COST_VOUCHER_ENDPOINT, {
        headers: {
          [AUTHORIZATION]:
            BEARER_HEADER_VALUE_PREFIX + clientHttpReq.token.accessToken,
        },
        params,
      })
      .pipe(
        map(data => data.data.data),
        switchMap((data: { name: string; docstatus: number }[]) => {
          if (data.length === 0 || this.validateDocCanceled(data)) {
            return of(true);
          }
          return throwError(
            new BadRequestException(`
          Found ${data.length} linked ${DOC_NAMES.LANDED_COST_VOUCHER} to ${
              DOC_NAMES.PURCHASE_RECEIPT
            } : ${data.map(element => element.name).join(', ')}`),
          );
        }),
      );
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

export interface DocInfoInterface {
  posting_date: string;
  grand_total: number;
  name: string;
  modified: string;
  docstatus: number;
}
