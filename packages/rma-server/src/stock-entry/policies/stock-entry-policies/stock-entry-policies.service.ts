import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { StockEntryDto } from '../../entities/stock-entry-dto';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { switchMap, mergeMap, toArray } from 'rxjs/operators';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import {
  STOCK_ENTRY_STATUS,
  STOCK_ENTRY_TYPE,
  AGENDA_JOB_STATUS,
  STOCK_ENTRY_PERMISSIONS,
  SYSTEM_MANAGER,
  NON_SERIAL_ITEM,
  PROGRESS_STATUS,
} from '../../../constants/app-strings';
import { StockEntry } from '../../entities/stock-entry.entity';
import { SerialNoHistoryPoliciesService } from '../../../serial-no/policies/serial-no-history-policies/serial-no-history-policies.service';
import { AgendaJobService } from '../../../sync/entities/agenda-job/agenda-job.service';
import { SerialNoPoliciesService } from '../../../serial-no/policies/serial-no-policies/serial-no-policies.service';
import { DateTime } from 'luxon';
import { getParsedPostingDate } from '../../../constants/agenda-job';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';
import { WarrantyClaimService } from '../../../warranty-claim/entity/warranty-claim/warranty-claim.service';
@Injectable()
export class StockEntryPoliciesService {
  constructor(
    private readonly serialNoService: SerialNoService,
    private readonly serialNoPolicy: SerialNoPoliciesService,
    private readonly agendaJob: AgendaJobService,
    private readonly settings: SettingsService,
    private readonly serialNoHistoryPolicyService: SerialNoHistoryPoliciesService,
    private readonly stockLedgerService: StockLedgerService,
    private readonly warrantyClaimService: WarrantyClaimService,
  ) {}

  validateStockEntry(payload: StockEntryDto) {
    return this.validateStockEntryItems(payload).pipe(
      switchMap(() => {
        return this.settings.find().pipe(
          switchMap(settings => {
            return this.validateStockSerials(
              payload,
              payload.stock_entry_type,
              settings,
            );
          }),
          switchMap(() => {
            if (
              payload.stock_entry_type === STOCK_ENTRY_TYPE.MATERIAL_RECEIPT
            ) {
              return of(true);
            }
            return this.validateItemStock(payload);
          }),
        );
      }),
    );
  }

  validateStockEntryItems(payload: StockEntryDto) {
    if (!payload.items?.length) {
      return throwError(new BadRequestException('Items cannot be empty.'));
    }
    return from(payload.items).pipe(
      mergeMap(item => {
        if (!item.has_serial_no) {
          return of(true);
        }
        const serialSet = new Set();
        const duplicateSerials = [];
        item.serial_no.forEach(no => {
          serialSet.has(no) ? duplicateSerials.push(no) : null;
          serialSet.add(no);
        });
        if (Array.from(serialSet).length !== item.serial_no.length) {
          return throwError(
            new BadRequestException(
              `Found following as duplicate serials for ${item.item_name}.
              ${duplicateSerials.splice(0, 50).join(', ')}...`,
            ),
          );
        }
        return of(true);
      }),
      toArray(),
      switchMap(() => of(true)),
    );
  }

  validateStockPermission(stock_entry_type: string, operation: string, req) {
    const message = new ForbiddenException(
      `User has no permissions for ${operation} operation, on ${stock_entry_type}`,
    );

    switch (stock_entry_type) {
      case STOCK_ENTRY_TYPE.MATERIAL_RECEIPT:
        return this.validateStockRoles(
          STOCK_ENTRY_PERMISSIONS.stock_entry_receipt[operation],
          req,
        )
          ? of(true)
          : throwError(message);

      case STOCK_ENTRY_TYPE.MATERIAL_TRANSFER:
        return this.validateStockRoles(
          STOCK_ENTRY_PERMISSIONS.stock_entry[operation],
          req,
        )
          ? of(true)
          : throwError(message);

      case STOCK_ENTRY_TYPE.RnD_PRODUCTS:
        return this.validateStockRoles(
          STOCK_ENTRY_PERMISSIONS.stock_entry_rnd[operation],
          req,
        )
          ? of(true)
          : throwError(message);

      case STOCK_ENTRY_TYPE.MATERIAL_ISSUE:
        return this.validateStockRoles(
          STOCK_ENTRY_PERMISSIONS.stock_entry_issue[operation],
          req,
        )
          ? of(true)
          : throwError(message);

      default:
        return throwError(new BadRequestException('Invalid StockEntry type'));
    }
  }

  validateStockRoles(permissions: string[], req) {
    permissions.push(SYSTEM_MANAGER);
    return permissions.some(p => req.token.roles.indexOf(p) >= 0);
  }

  validateItemStock(payload: StockEntryDto) {
    return this.settings.find().pipe(
      switchMap(() => {
        if (payload?.items?.length === 0) {
          return of(true);
        }
        return from(payload.items).pipe(
          switchMap(item => {
            const body = {
              item_code: item.item_code,
              warehouse: item.s_warehouse,
            };
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
                  Only ${message} available in stock for item ${item.item_name},
                  at warehouse ${item.s_warehouse}.
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
      switchMap(() => of(true)),
    );
  }

  validateStockEntryCancel(stockEntry: StockEntry): Observable<StockEntry> {
    if (
      ![
        STOCK_ENTRY_STATUS.delivered,
        STOCK_ENTRY_STATUS.returned,
        STOCK_ENTRY_STATUS.in_transit,
      ].includes(stockEntry.status)
    ) {
      return throwError(
        new BadRequestException(
          `${stockEntry.status} stock entry cannot be canceled`,
        ),
      );
    }

    switch (stockEntry.stock_entry_type) {
      case STOCK_ENTRY_TYPE.MATERIAL_TRANSFER:
        return this.validateMaterialTransferReset(stockEntry);

      case STOCK_ENTRY_TYPE.MATERIAL_ISSUE:
        return this.validateMaterialIssueReset(stockEntry);

      case STOCK_ENTRY_TYPE.MATERIAL_RECEIPT:
        return this.validateMaterialReceiptReset(stockEntry);

      case STOCK_ENTRY_TYPE.RnD_PRODUCTS:
        return this.validateMaterialIssueReset(stockEntry);

      default:
        return throwError(new BadRequestException('Invalid Stock Entry'));
    }
  }

  validateMaterialTransferReset(stockEntry: StockEntry) {
    const message = `Stock Entry with status ${stockEntry.status}, cannot be reseted`;
    switch (stockEntry.status) {
      case STOCK_ENTRY_STATUS.draft:
        return throwError(new BadRequestException(message));

      case STOCK_ENTRY_STATUS.reseted:
        return throwError(new BadRequestException(message));

      default:
        return forkJoin({
          validateSerialState: this.validateSerialState(stockEntry),
          validateSerials: this.validateMaterialReceiptSerials(stockEntry),
          validateQueueState: this.validateStockEntryQueue(stockEntry),
        }).pipe(switchMap(() => of(stockEntry)));
    }
  }

  validateMaterialReceiptReset(stockEntry: StockEntry) {
    return forkJoin({
      validateSerialState: this.validateSerialState(stockEntry),
      validateSerials: this.validateMaterialReceiptSerials(stockEntry),
    }).pipe(
      switchMap(() => {
        return of(stockEntry);
      }),
    );
  }

  validateMaterialIssueReset(stockEntry: StockEntry) {
    return forkJoin({
      validateSerialState: this.validateSerialState(stockEntry),
      validateSerials: this.validateMaterialIssueSerials(stockEntry),
    }).pipe(
      switchMap(() => {
        return of(stockEntry);
      }),
    );
  }

  validateMaterialIssueSerials(invoice: StockEntry) {
    const serials = this.getInvoiceSerials(invoice);
    return this.serialNoHistoryPolicyService
      .validateLatestEventWithParent(invoice.uuid, serials)
      .pipe(
        switchMap(response => {
          let message = `Found ${response.length} Events, please cancel Following events for serials`;
          response.forEach(value =>
            value
              ? (message += `${value._id} : ${value.serials
                  .splice(0, 50)
                  .join(', ')}`)
              : null,
          );
          if (response && response.length) {
            return throwError(message);
          }
          return of(true);
        }),
      );
  }

  validateStockEntryQueue(stockEntry: StockEntry) {
    return from(
      this.agendaJob.count({
        'data.parent': stockEntry.uuid,
        'data.status': {
          $in: [
            AGENDA_JOB_STATUS.exported,
            AGENDA_JOB_STATUS.fail,
            AGENDA_JOB_STATUS.in_queue,
            AGENDA_JOB_STATUS.retrying,
          ],
        },
      }),
    ).pipe(
      switchMap(response => {
        if (response) {
          return throwError(
            new BadRequestException(
              `Found ${response}, jobs in queue for sales invoice: ${stockEntry.uuid}`,
            ),
          );
        }
        return of(true);
      }),
    );
  }

  getInvoiceSerials(invoice: StockEntry) {
    const serials = [];
    invoice.items.forEach(item =>
      item.has_serial_no ? serials.push(...item.serial_no) : null,
    );
    return serials;
  }

  validateMaterialReceiptSerials(invoice: StockEntry) {
    const serials = this.getInvoiceSerials(invoice);
    return this.serialNoHistoryPolicyService
      .validateLatestEventWithParent(invoice.uuid, serials)
      .pipe(
        switchMap(response => {
          let message = `Found ${response.length} Events, please cancel Following events for serials`;
          response.forEach(value =>
            value
              ? (message += `${value._id} : ${value.serials
                  .splice(0, 50)
                  .join(', ')}`)
              : null,
          );
          if (response && response.length) {
            return throwError(new BadRequestException(message));
          }
          return of(invoice);
        }),
      );
  }

  validateSerialState(invoice: StockEntry) {
    return from(
      this.serialNoService.count({
        purchase_invoice_name: invoice.uuid,
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

  validateStockSerials(
    payload: StockEntryDto,
    stock_entry_type: string,
    settings,
  ) {
    return from(payload.items).pipe(
      mergeMap(item => {
        if (!item.has_serial_no) {
          return of(true);
        }
        let query: any = {
          serial_no: { $in: item.serial_no },
          item_code: item.item_code,
          warehouse: item.s_warehouse,
          'queue_state.purchase_receipt': { $exists: false },
          $or: [
            {
              'warranty.soldOn': { $exists: false },
            },
            {
              'warranty.claim_no': { $exists: true },
            },
          ],
        };
        if (stock_entry_type === STOCK_ENTRY_TYPE.MATERIAL_RECEIPT) {
          query = {
            serial_no: { $in: item.serial_no },
            $or: [
              { 'queue_state.purchase_receipt': { $exists: true } },
              { 'queue_state.stock_entry': { $exists: true } },
              { purchase_document_no: { $exists: true } },
            ],
          };
        }
        if (stock_entry_type !== STOCK_ENTRY_TYPE.MATERIAL_RECEIPT) {
          query['warranty.purchasedOn'] = {
            $lte: DateTime.fromJSDate(getParsedPostingDate(payload))
              .setZone(settings.timeZone)
              .toJSDate(),
          };
        }

        return from(this.serialNoService.count(query)).pipe(
          mergeMap(count => {
            const message = `Found ${count} Qty for Item : ${item.item_name} at warehouse: ${item.s_warehouse}.`;
            if (
              [
                STOCK_ENTRY_TYPE.MATERIAL_TRANSFER,
                STOCK_ENTRY_TYPE.MATERIAL_ISSUE,
                STOCK_ENTRY_TYPE.RnD_PRODUCTS,
              ].includes(stock_entry_type)
            ) {
              return count === item.serial_no.length
                ? of(true)
                : this.getDeliveryNoteInvalidSerials(item);
            }
            if (stock_entry_type === STOCK_ENTRY_TYPE.MATERIAL_RECEIPT) {
              return count === 0
                ? of(true)
                : this.getReceiptInvalidSerials(query, count);
            }
            return throwError(new BadRequestException(message));
          }),
        );
      }),
      toArray(),
      switchMap(() => {
        return of(true);
      }),
    );
  }

  getDeliveryNoteInvalidSerials(item) {
    return this.serialNoPolicy
      .validateSerials({
        item_code: item.item_code,
        serials: item.serial_no,
        warehouse: item.s_warehouse,
        validateFor: 'delivery_note',
      })
      .pipe(
        switchMap(data => {
          return data.notFoundSerials?.length
            ? throwError(
                new BadRequestException(`
            Found ${data?.notFoundSerials.length}
            Invalid Serials: ${data?.notFoundSerials
              ?.splice(0, 50)
              .join(', ')}`),
              )
            : throwError(
                new BadRequestException(
                  `Please check purchased date and related fields for provided serials.`,
                ),
              );
        }),
      );
  }

  getReceiptInvalidSerials(query, count) {
    return from(
      this.serialNoService.find({
        where: query,
        limit: 50,
      }),
    ).pipe(
      switchMap(serials => {
        return throwError(
          new BadRequestException(
            `Found ${count} invalid serials. ${serials
              .map(s => s.serial_no)
              .join(', ')}`,
          ),
        );
      }),
    );
  }

  validateCancelWarrantyStockEntry(parent_document: string, serial_no) {
    if (serial_no.toUpperCase() !== NON_SERIAL_ITEM.length) {
      return this.serialNoHistoryPolicyService
        .validateLatestEventWithParent(parent_document, serial_no)
        .pipe(
          switchMap(response => {
            let message = `Found ${response.length} Events, please cancel Following events for serials
      `;
            response.forEach(value =>
              value
                ? (message += `${value._id} : ${value.serials
                    .splice(0, 50)
                    .join(', ')}`)
                : null,
            );
            return of(true);
          }),
        );
    }
    return of(true);
  }

  // check for duplication of stock entry
  validateWarrantyStockEntry(payload: StockEntryDto) {
    return from(
      this.warrantyClaimService.findOne({ uuid: payload.warrantyClaimUuid }),
    ).pipe(
      switchMap(res => {
        if (
          // if duplicate stock entry type found then throw error
          res.replace_serial &&
          res?.progress_state?.find(
            state =>
              state.stock_entry_type === payload.stock_entry_type &&
              state.type !== PROGRESS_STATUS.SPARE_PARTS,
          )
        ) {
          return throwError(
            new BadRequestException(
              `Stock Entry already exists. Cannot create a duplicate entry.`,
            ),
          );
        }
        return of(true);
      }),
    );
  }

  // check if the product is in stock
  validateWarrantyStockSerials(payload: StockEntryDto) {
    return from(payload.items).pipe(
      mergeMap(item => {
        // if the product is of returned type then no need to check in warehouse
        if (payload.stock_entry_type === STOCK_ENTRY_STATUS.returned) {
          return of(true);
        }
        // if product has no serial return true
        if (!item.has_serial_no) {
          return of(true);
        }
        return from(
          this.serialNoService.count({
            serial_no: { $in: item.serial_no },
            item_code: item.item_code,
            $or: [
              {
                $or: [
                  { warehouse: item.s_warehouse },
                  {
                    'queue_state.purchase_receipt.warehouse': item.s_warehouse,
                  },
                ],
              },
              {
                $or: [
                  {
                    'warranty.soldOn': { $exists: false },
                    'queue_state.delivery_note': { $exists: false },
                  },
                  {
                    'warranty.claim_no': { $exists: true },
                  },
                ],
              },
            ],
          }),
        ).pipe(
          mergeMap(count => {
            if (count === item.serial_no.length) {
              return of(true);
            }
            return throwError(
              new BadRequestException(
                `Expected ${item.serial_no.length} serials for Item: ${item.item_name} at warehouse: ${item.s_warehouse}, found ${count}.`,
              ),
            );
          }),
        );
      }),
      toArray(),
      switchMap(() => {
        return of(true);
      }),
    );
  }
}
