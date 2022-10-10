import {
  Injectable,
  BadRequestException,
  HttpService,
  UnauthorizedException,
} from '@nestjs/common';
import { SalesInvoiceService } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.service';
import { from, throwError, of, forkJoin } from 'rxjs';
import { switchMap, map, mergeMap, toArray, concatMap } from 'rxjs/operators';
import {
  SALES_INVOICE_NOT_FOUND,
  CUSTOMER_AND_CONTACT_INVALID,
  SALES_INVOICE_CANNOT_BE_SUBMITTED,
  DELIVERY_NOTE_IN_QUEUE,
  ITEMS_SHOULD_BE_UNIQUE,
  INVALID_ITEM_TOTAL,
  CREDIT_LIMIT_ERROR,
} from '../../../constants/messages';
import { CustomerService } from '../../../customer/entity/customer/customer.service';
import { CreateSalesReturnDto } from '../../entity/sales-invoice/sales-return-dto';
import { ItemDto } from '../../entity/sales-invoice/sales-invoice-dto';
import { AssignSerialNoPoliciesService } from '../../../serial-no/policies/assign-serial-no-policies/assign-serial-no-policies.service';
import {
  DRAFT_STATUS,
  COMPLETED_STATUS,
  TO_DELIVER_STATUS,
  CANCELED_STATUS,
} from '../../../constants/app-strings';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import {
  FRAPPE_API_SALES_INVOICE_ENDPOINT,
  POST_DELIVERY_NOTE_ENDPOINT,
} from '../../../constants/routes';
import { SerialNoPoliciesService } from '../../../serial-no/policies/serial-no-policies/serial-no-policies.service';
import { SalesInvoice } from '../../entity/sales-invoice/sales-invoice.entity';
import { getParsedPostingDate } from '../../../constants/agenda-job';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';

@Injectable()
export class SalesInvoicePoliciesService {
  constructor(
    private readonly salesInvoiceService: SalesInvoiceService,
    private readonly customerService: CustomerService,
    private readonly assignSerialPolicyService: AssignSerialNoPoliciesService,
    private readonly serialNoPoliciesService: SerialNoPoliciesService,
    private readonly http: HttpService,
    private readonly clientToken: ClientTokenManagerService,
    private readonly settings: SettingsService,
    private readonly stockLedgerService: StockLedgerService,
  ) {}

  validateSalesInvoice(uuid: string) {
    return from(this.salesInvoiceService.findOne({ uuid })).pipe(
      switchMap(salesInvoice => {
        if (!salesInvoice) {
          return throwError(new BadRequestException(SALES_INVOICE_NOT_FOUND));
        }
        return of(salesInvoice);
      }),
    );
  }

  validateItems(items: ItemDto[]) {
    const itemSet = new Set();
    items.forEach(item => {
      itemSet.add(item.item_code);
    });
    const item_code: any[] = Array.from(itemSet);
    if (item_code.length !== items.length) {
      return throwError(new BadRequestException(ITEMS_SHOULD_BE_UNIQUE));
    }
    return this.validateItemsTotal(items).pipe(
      switchMap(() => {
        return this.assignSerialPolicyService.validateItem(item_code);
      }),
      switchMap(() => {
        return from(items).pipe(
          mergeMap(item => {
            return this.assignSerialPolicyService.validateItemRate(item);
          }),
        );
      }),
      toArray(),
      switchMap(success => of(true)),
    );
  }
  validateItemsTotal(items: ItemDto[]) {
    for (let i = 0; i <= items.length - 1; i++) {
      if (items[i].amount !== items[i].qty * items[i].rate) {
        return throwError(
          new BadRequestException(
            this.assignSerialPolicyService.getMessage(
              INVALID_ITEM_TOTAL,
              items[i].qty * items[i].rate,
              items[i].amount,
            ),
          ),
        );
      }
    }
    return of({});
  }
  validateCustomer(salesInvoicePayload: {
    customer: string;
    contact_email: string;
  }) {
    return from(
      this.customerService.findOne({
        name: salesInvoicePayload.customer,
        owner: salesInvoicePayload.contact_email,
      }),
    ).pipe(
      switchMap(customer => {
        if (!customer) {
          return throwError(
            new BadRequestException(CUSTOMER_AND_CONTACT_INVALID),
          );
        }
        return of(true);
      }),
    );
  }

  validateCustomerCreditLimit(salesInvoicePayload: {
    customer: string;
    contact_email: string;
  }) {
    return forkJoin({
      customer: from(
        this.customerService.findOne({
          name: salesInvoicePayload.customer,
          owner: salesInvoicePayload.contact_email,
        }),
      ),
      settings: this.settings.find(),
    }).pipe(
      switchMap(({ customer, settings }) => {
        if (!customer) {
          return throwError(
            new BadRequestException(CUSTOMER_AND_CONTACT_INVALID),
          );
        }

        // Get customer credit limit for default company.
        let credit_limits = [];
        if (customer.credit_limits && customer.credit_limits.length > 0) {
          credit_limits = customer.credit_limits.filter(limit => {
            if (limit.company === settings.defaultCompany) {
              return limit;
            }
          });
        }

        // Check if fields exist
        if (
          credit_limits.length > 0 &&
          customer.baseCreditLimitAmount &&
          customer.tempCreditLimitPeriod
        ) {
          // Check if credit limit has failed to reset
          if (
            credit_limits[0].credit_limit > customer.baseCreditLimitAmount &&
            customer.tempCreditLimitPeriod < new Date()
          ) {
            return throwError(new UnauthorizedException(CREDIT_LIMIT_ERROR));
          }
        }
        return of(true);
      }),
    );
  }

  validateSubmittedState(salesInvoicePayload: { uuid: string }) {
    return from(
      this.salesInvoiceService.findOne({ uuid: salesInvoicePayload.uuid }),
    ).pipe(
      switchMap(salesInvoice => {
        if (salesInvoice.status !== DRAFT_STATUS) {
          return throwError(
            new BadRequestException(
              salesInvoice.status + SALES_INVOICE_CANNOT_BE_SUBMITTED,
            ),
          );
        }
        return of(true);
      }),
    );
  }
  validateQueueState(salesInvoicePayload: { uuid: string }) {
    return from(
      this.salesInvoiceService.findOne({ uuid: salesInvoicePayload.uuid }),
    ).pipe(
      switchMap(queueState => {
        if (queueState.inQueue) {
          return throwError(new BadRequestException(DELIVERY_NOTE_IN_QUEUE));
        }
        return of(queueState);
      }),
    );
  }

  validateSalesInvoiceStock(sales_invoice: SalesInvoice, req) {
    return this.settings.find().pipe(
      switchMap(settings => {
        if (!settings.validateStock) {
          return of(true);
        }
        return from(sales_invoice.items).pipe(
          concatMap(item => {
            if (item.has_bundle_item || item.is_stock_item === 0) {
              return of(true);
            }
            const body = {
              item_code: item.item_code,
              warehouse: sales_invoice.delivery_warehouse,
            };
            // const headers = this.settings.getAuthorizationHeaders(req.token);
            return from(
              this.stockLedgerService.asyncAggregate([
                {
                  $match: {
                    item_code: item.item_code,
                    warehouse: body.warehouse,
                  },
                },
                {
                  $group: { _id: null, sum: { $sum: '$actual_qty' } },
                },
                { $project: { sum: 1 } },
              ]),
            ).pipe(
              switchMap((stockCount: [{ sum: number }]) => {
                const message = stockCount.find(summedData => summedData).sum;
                if (message < item.qty) {
                  return throwError(
                    new BadRequestException(`
                  Only ${message} quantity available in stock for item ${item.item_name}, 
                  at warehouse ${sales_invoice.delivery_warehouse}.
                  `),
                  );
                }
                return of(true);
              }),
            );
          }),
        );
      }),
      toArray(),
      switchMap(success => of(true)),
    );
  }

  validateSalesReturnItems(payload: CreateSalesReturnDto) {
    return from(payload.items).pipe(
      mergeMap(item => {
        if (!item.has_serial_no) {
          return of(true);
        }
        const serialSet = new Set();
        const duplicateSerials = [];
        const serials = item.serial_no.split('\n');
        serials.forEach(no => {
          serialSet.has(no) ? duplicateSerials.push(no) : null;
          serialSet.add(no);
        });
        if (Array.from(serialSet).length !== serials.length) {
          return throwError(
            new BadRequestException(
              `Found following as duplicate serials for ${
                item.item_name || item.item_code
              }. 
              ${duplicateSerials.splice(0, 50).join(', ')}...`,
            ),
          );
        }
        return of(true);
      }),
      toArray(),
      switchMap(success => of(true)),
    );
  }

  validateReturnPostingDate(
    createReturnPayload: CreateSalesReturnDto,
    salesInvoice,
  ) {
    if (
      getParsedPostingDate(salesInvoice) >
      getParsedPostingDate(createReturnPayload)
    ) {
      return throwError(
        new BadRequestException(
          'posting date cannot be before sales invoice posting.',
        ),
      );
    }
    return of(salesInvoice);
  }

  validateSalesReturn(createReturnPayload: CreateSalesReturnDto) {
    const items = createReturnPayload.items;
    const data = new Set();
    items.forEach(item => {
      data.add(item.against_sales_invoice);
    });
    const salesInvoiceName: any[] = Array.from(data);
    if (salesInvoiceName.length === 1) {
      return from(
        this.salesInvoiceService.findOne({ name: salesInvoiceName[0] }),
      ).pipe(
        switchMap(salesInvoice => {
          return this.validateReturnPostingDate(
            createReturnPayload,
            salesInvoice,
          );
        }),
      );
    }
    return throwError(
      new BadRequestException(
        this.getMessage(SALES_INVOICE_NOT_FOUND, 1, salesInvoiceName.length),
      ),
    );
  }

  validateReturnSerials(payload: CreateSalesReturnDto) {
    return from(payload.items).pipe(
      mergeMap(item => {
        if (!item.has_serial_no) {
          return of({ notFoundSerials: [] });
        }
        return this.serialNoPoliciesService.validateReturnSerials({
          delivery_note_names: payload.delivery_note_names,
          item_code: item.item_code,
          serials: item.serial_no.split('\n'),
          warehouse: payload.set_warehouse,
        });
      }),
      toArray(),
      switchMap((res: { notFoundSerials: string[] }[]) => {
        const invalidSerials = [];

        res.forEach(invalidSerial => {
          invalidSerials.push(...invalidSerial.notFoundSerials);
        });

        if (invalidSerials.length > 0) {
          return throwError(
            new BadRequestException({
              invalidSerials: invalidSerials.splice(0, 50).join(', '),
            }),
          );
        }
        return of(true);
      }),
    );
  }

  getMessage(notFoundMessage, expected, found) {
    return `${notFoundMessage}, expected ${expected || 0} found ${found || 0}`;
  }

  validateInvoiceStateForCancel(status: string) {
    if (status === TO_DELIVER_STATUS || status === COMPLETED_STATUS) {
      return of(true);
    }
    return throwError(
      new BadRequestException(
        `Cannot cancel sales invoice with status ${status}`,
      ),
    );
  }

  validateInvoiceOnErp(salesInvoicePayload: { uuid: string; name: string }) {
    return forkJoin({
      headers: this.clientToken.getServiceAccountApiHeaders(),
      settings: this.settings.find(),
    }).pipe(
      switchMap(({ headers, settings }) => {
        return this.http
          .get(
            `${settings.authServerURL}${FRAPPE_API_SALES_INVOICE_ENDPOINT}/${salesInvoicePayload.name}`,
            { headers },
          )
          .pipe(
            map(res => res.data),
            switchMap(async (invoice: { docstatus: number }) => {
              if (invoice.docstatus === 2) {
                await this.salesInvoiceService.updateOne(
                  { uuid: salesInvoicePayload.uuid },
                  {
                    $set: {
                      status: CANCELED_STATUS,
                      inQueue: false,
                      isSynced: true,
                    },
                  },
                );
                return throwError(
                  new BadRequestException('Invoice already Cancelled'),
                );
              }
              return of(true);
            }),
          );
      }),
    );
  }

  getDeliveryNotes(sales_invoice_name: string) {
    return forkJoin({
      headers: this.clientToken.getServiceAccountApiHeaders(),
      settings: this.settings.find(),
    }).pipe(
      switchMap(({ headers, settings }) => {
        const params = {
          filters: JSON.stringify([
            ['against_sales_invoice', '=', sales_invoice_name],
            ['docstatus', '!=', 2],
          ]),
        };
        return this.http
          .get(`${settings.authServerURL}${POST_DELIVERY_NOTE_ENDPOINT}`, {
            params,
            headers,
          })
          .pipe(
            map(res => res.data.data),
            switchMap((deliveryNotes: any[]) => {
              return of(deliveryNotes.map(delivery_note => delivery_note.name));
            }),
          );
      }),
    );
  }

  getSalesInvoices(sales_invoice_name: string) {
    return forkJoin({
      headers: this.clientToken.getServiceAccountApiHeaders(),
      settings: this.settings.find(),
    }).pipe(
      switchMap(({ headers, settings }) => {
        const params = {
          filters: JSON.stringify([
            ['return_against', '=', sales_invoice_name],
            ['docstatus', '!=', 2],
          ]),
        };
        return this.http
          .get(
            `${settings.authServerURL}${FRAPPE_API_SALES_INVOICE_ENDPOINT}`,
            {
              params,
              headers,
            },
          )
          .pipe(
            map(res => res.data.data),
            switchMap((salesInvoices: any[]) => {
              if (salesInvoices.length !== 0)
                return of(
                  salesInvoices.map(sales_invoice => sales_invoice.name),
                );
              return of([]);
            }),
          );
      }),
    );
  }
}
