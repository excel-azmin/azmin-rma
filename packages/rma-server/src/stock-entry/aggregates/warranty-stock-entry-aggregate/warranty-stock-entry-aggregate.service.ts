import { Injectable, BadRequestException } from '@nestjs/common';
import { StockEntryService } from '../../entities/stock-entry.service';
import { from, throwError, of, forkJoin } from 'rxjs';
import {
  CANCEL_WARRANTY_STOCK_ENTRY,
  CURRENT_STATUS_VERDICT,
  DELIVERY_STATUS,
  NON_SERIAL_ITEM,
  STOCK_ENTRY,
  STOCK_ENTRY_STATUS,
  VERDICT,
  WARRANTY_CLAIM_DOCTYPE,
  WARRANTY_TYPE,
} from '../../../constants/app-strings';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { WarrantyStockEntryDto } from '../../entities/warranty-stock-entry-dto';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { StockEntry } from '../../entities/stock-entry.entity';
import { switchMap, map, toArray, concatMap, catchError } from 'rxjs/operators';
import { WarrantyClaimService } from '../../../warranty-claim/entity/warranty-claim/warranty-claim.service';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import {
  EventType,
  SerialNoHistoryInterface,
} from '../../../serial-no/entity/serial-no-history/serial-no-history.entity';
import { StockEntryPoliciesService } from '../../../stock-entry/policies/stock-entry-policies/stock-entry-policies.service';
import { WarrantyClaimAggregateService } from '../../../warranty-claim/aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';
import { PROGRESS_STATUS } from '../../../constants/app-strings';
import { StockLedger } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.entity';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';

@Injectable()
export class WarrantyStockEntryAggregateService {
  constructor(
    private readonly stockEntryService: StockEntryService,
    private readonly settingService: SettingsService,
    private readonly serialService: SerialNoService,
    private readonly warrantyService: WarrantyClaimService,
    private readonly serialNoHistoryService: SerialNoHistoryService,
    private readonly stockEntryPoliciesService: StockEntryPoliciesService,
    private readonly warrantyAggregateService: WarrantyClaimAggregateService,
    private readonly stockLedgerService: StockLedgerService,
  ) {}

  createDeliveryNote(deliveryNotes: WarrantyStockEntryDto[], req) {
    const warrantyPayload: any = {};
    let deliveryNotesList: any[] = [];
    let settingState = {} as ServerSettings;
    let deliveredStockId;
    let returnedStockId;
    return from(deliveryNotes).pipe(
      concatMap(singleDeliveryNote => {
        Object.assign(warrantyPayload, singleDeliveryNote);
        return forkJoin({
          deliveryNote: of(singleDeliveryNote),
          validStockEntry: this.stockEntryPoliciesService.validateWarrantyStockEntry(
            warrantyPayload,
          ),
          validSerials: this.stockEntryPoliciesService.validateWarrantyStockSerials(
            warrantyPayload,
          ),
          warrantyPayload: of(warrantyPayload),
          settings: this.settingService.find(),
        });
      }),
      toArray(),
      switchMap(settings => {
        return from(deliveryNotes).pipe(
          concatMap(deliveryNote => {
            deliveryNote.status = undefined;
            deliveryNote.stock_voucher_number = uuidv4();
            return this.makeStockEntry(
              deliveryNote,
              req,
              settings.find(x => x.settings).settings,
            ).pipe(
              map((res: any) => {
                res.subscribe((data: any) => {
                  if (
                    deliveryNote.stock_entry_type ===
                    STOCK_ENTRY_STATUS.delivered
                  ) {
                    deliveredStockId = data.ops[0].stock_id;
                  } else if (
                    deliveryNote.stock_entry_type ===
                    STOCK_ENTRY_STATUS.returned
                  ) {
                    returnedStockId = data.ops[0].stock_id;
                  }
                  return data.ops[0];
                });
              }),
              switchMap(() => {
                return this.updateProgressState(deliveryNote);
              }),
            );
          }),
          toArray(),
        );
      }),
      switchMap(() => {
        return forkJoin({
          warranty: from(
            this.warrantyService.findOne({
              uuid: warrantyPayload.warrantyClaimUuid,
            }),
          ),
          settings: this.settingService.find(),
        }).pipe(
          switchMap(({ warranty, settings }) => {
            if (warranty.serial_no === undefined) {
              warranty.serial_no = '';
            }
            deliveryNotesList = warranty.progress_state;
            settingState = settings;
            return from(deliveryNotesList).pipe(
              concatMap(deliveryNote => {
                return this.updateSerials(
                  deliveryNote,
                  warranty.serial_no,
                  settings,
                );
              }),
              toArray(),
            );
          }),
        );
      }),
      switchMap(() => {
        return from(deliveryNotesList).pipe(
          concatMap(deliveryNote => {
            return this.createSerialNoHistory(
              deliveryNote,
              deliveredStockId,
              returnedStockId,
              settingState,
              req,
            );
          }),
          toArray(),
        );
      }),
      switchMap(() => {
        return from(deliveryNotesList).pipe(
          concatMap(deliveryNote => {
            return this.syncProgressState(
              warrantyPayload.warrantyClaimUuid,
              deliveryNote,
            );
          }),
          toArray(),
        );
      }),
      switchMap(() => {
        return from(deliveryNotes).pipe(
          concatMap(deliveryNote => {
            return this.createStockLedger(
              deliveryNote,
              req.token,
              settingState,
            );
          }),
        );
      }),
      catchError(err => {
        return throwError(new BadRequestException(err));
      }),
    );
  }

  makeStatusHistory(uuid: string, req) {
    return forkJoin({
      warranty: this.warrantyService.findOne(uuid),
      settingState: this.settingService.find(),
    }).pipe(
      switchMap(claim => {
        if (
          claim.warranty.status_history[
            claim.warranty.status_history.length - 1
          ].verdict === VERDICT.DELIVER_TO_CUSTOMER
        ) {
          return throwError(
            new BadRequestException('Stock Entries Already Finalized'),
          );
        }
        this.serialNoHistoryService.updateMany(
          {
            document_no: { $eq: claim.warranty.claim_no },
          },
          {
            $set: {
              eventType: VERDICT.DELIVER_TO_CUSTOMER,
            },
          },
        );
        const statusHistoryDetails = {} as any;
        statusHistoryDetails.uuid = claim.warranty.uuid;
        statusHistoryDetails.time = claim.warranty.posting_time;
        statusHistoryDetails.posting_date = new DateTime(
          claim.settingState.timeZone,
        ).toFormat('yyyy-MM-dd');
        statusHistoryDetails.status_from = req.token.territory[0];
        statusHistoryDetails.verdict = VERDICT.DELIVER_TO_CUSTOMER;
        statusHistoryDetails.description =
          claim.warranty.progress_state[0].description;
        statusHistoryDetails.created_by_email = req.token.email;
        statusHistoryDetails.created_by = req.token.name;
        switch (claim.warranty.progress_state[0].type) {
          case PROGRESS_STATUS.REPLACE:
            statusHistoryDetails.delivery_status = DELIVERY_STATUS.REPLACED;
            break;
          case PROGRESS_STATUS.UPGRADE:
            statusHistoryDetails.delivery_status = DELIVERY_STATUS.UPGRADED;
            break;
          case PROGRESS_STATUS.SPARE_PARTS:
            statusHistoryDetails.delivery_status = DELIVERY_STATUS.REPAIRED;
            break;
          default:
            return throwError(new BadRequestException(`not valid type`));
        }
        return this.warrantyAggregateService.addStatusHistory(
          statusHistoryDetails,
          req,
        );
      }),
      switchMap(() => {
        return from(
          this.warrantyService.updateOne(uuid, {
            $set: {
              delivery_branch: req.token.territory[0],
            },
          }),
        );
      }),
      catchError(err => {
        return throwError(new BadRequestException(err));
      }),
    );
  }

  createStockLedger(
    payload: WarrantyStockEntryDto,
    token,
    settings: ServerSettings,
  ) {
    return this.createStockLedgerPayload(payload, token, settings).pipe(
      switchMap((stockLedgers: StockLedger[]) => {
        return from(stockLedgers).pipe(
          switchMap(stockLedger => {
            return from(this.stockLedgerService.create(stockLedger));
          }),
        );
      }),
    );
  }

  createStockLedgerPayload(
    res: WarrantyStockEntryDto,
    token,
    settings: ServerSettings,
  ) {
    return this.settingService.getFiscalYear(settings).pipe(
      switchMap(fiscalYear => {
        const date = new DateTime(settings.timeZone).toJSDate();
        return from(res.items).pipe(
          concatMap((item: any) => {
            const stockPayload = new StockLedger();
            stockPayload.name = uuidv4();
            stockPayload.modified = date;
            stockPayload.modified_by = token.email;

            if (res.action === CANCEL_WARRANTY_STOCK_ENTRY) {
              if (res.stock_entry_type === STOCK_ENTRY_STATUS.returned) {
                if (item.qty < 0) {
                  item.qty = -item.qty;
                }
                stockPayload.actual_qty = -item.qty;
              } else {
                stockPayload.actual_qty = item.qty;
              }
            } else {
              if (res.stock_entry_type === STOCK_ENTRY_STATUS.returned) {
                stockPayload.actual_qty = item.qty;
              } else {
                stockPayload.actual_qty = -item.qty;
              }
            }
            stockPayload.warehouse = item.s_warehouse
              ? item.s_warehouse
              : item.warehouse;
            stockPayload.item_code = item.item_code;
            stockPayload.valuation_rate = 0;
            stockPayload.batch_no = '';
            stockPayload.posting_date = date;
            stockPayload.posting_time = date;
            stockPayload.voucher_type = STOCK_ENTRY;
            stockPayload.voucher_no = res.stock_voucher_number;
            stockPayload.voucher_detail_no = '';
            stockPayload.incoming_rate = 0;
            stockPayload.outgoing_rate = 0;
            stockPayload.company = settings.defaultCompany;
            stockPayload.fiscal_year = fiscalYear;
            return of(stockPayload);
          }),
          toArray(),
          switchMap(data => {
            return of(data);
          }),
        );
      }),
    );
  }

  makeStockEntry(deliveryNote: WarrantyStockEntryDto, req, settings) {
    const stockEntry: any = this.setStockEntryDefaults(
      deliveryNote,
      req,
      settings,
    );
    stockEntry.items[0].serial_no = deliveryNote.items[0].serial_no;
    return this.getAssignStockId(stockEntry).pipe(
      map((res: StockEntry) => {
        return from(this.stockEntryService.create(res));
      }),
    );
  }

  updateProgressState(deliveryNote) {
    deliveryNote.isSync = false;
    let serialData = {} as any;
    switch (deliveryNote.stock_entry_type) {
      case STOCK_ENTRY_STATUS.returned:
        serialData = {
          damaged_serial: deliveryNote.items[0].serial_no,
          damage_warehouse: deliveryNote.items[0].s_warehouse,
          damage_product: deliveryNote.items[0].item_name,
        };
        break;
      case STOCK_ENTRY_STATUS.delivered:
        serialData = {
          replace_serial: deliveryNote.items[0].serial_no,
          replace_warehouse: deliveryNote.items[0].s_warehouse,
          replace_product: deliveryNote.items[0].item_name,
        };
        break;
      default:
        return throwError(new BadRequestException(`not valid type`));
    }
    return from(
      this.warrantyService.updateOne(
        { uuid: deliveryNote.warrantyClaimUuid },
        {
          $push: {
            progress_state: deliveryNote,
          },
          $set: serialData,
        },
      ),
    );
  }

  createSerialNoHistory(
    deliveryNote,
    deliveredStockId,
    returnedStockId,
    settings,
    req,
  ) {
    if (deliveryNote.isSync) {
      return of({});
    }
    const serialHistory: SerialNoHistoryInterface = {};
    serialHistory.naming_series = deliveryNote.naming_series;
    serialHistory.serial_no = deliveryNote.items[0].serial_no[0];
    serialHistory.created_by = req.token.fullName;
    serialHistory.created_on = new DateTime(settings.timeZone).toJSDate();
    serialHistory.document_no = deliveryNote.stock_voucher_number;

    if (deliveryNote.stock_entry_type === STOCK_ENTRY_STATUS.delivered) {
      serialHistory.readable_document_no = deliveredStockId;
    } else if (deliveryNote.stock_entry_type === STOCK_ENTRY_STATUS.returned) {
      serialHistory.readable_document_no = returnedStockId;
    }

    serialHistory.document_type = WARRANTY_CLAIM_DOCTYPE;
    serialHistory.eventDate = new DateTime(settings.timeZone);
    serialHistory.parent_document = deliveryNote.warrantyClaimUuid;
    switch (deliveryNote.stock_entry_type) {
      case STOCK_ENTRY_STATUS.returned:
        const verdict = Object.keys(VERDICT).find(
          key => VERDICT[key] === VERDICT.RECEIVED_FROM_CUSTOMER,
        );
        const event = EventType[verdict];
        serialHistory.eventType = event;
        serialHistory.transaction_from = deliveryNote.customer;
        serialHistory.transaction_to = !deliveryNote.items[0].warehouse
          ? deliveryNote.customer
          : deliveryNote.items[0].warehouse;
        break;
      case STOCK_ENTRY_STATUS.delivered:
        const verdict_key = Object.keys(VERDICT).find(
          key => VERDICT[key] === VERDICT.DELIVER_TO_CUSTOMER,
        );
        const eventType = EventType[verdict_key];
        serialHistory.eventType = eventType;
        serialHistory.transaction_from = req.token.territory[0];
        serialHistory.transaction_to = !deliveryNote.customer
          ? req.token.territory[0]
          : deliveryNote.customer;
        break;
      default:
        break;
    }
    return this.serialNoHistoryService.addSerialHistory(
      [deliveryNote.items[0].serial_no],
      serialHistory,
    );
  }

  syncProgressState(uuid, deliveryNote) {
    return from(
      this.warrantyService.updateOne(
        {
          uuid,
          'progress_state.stock_voucher_number':
            deliveryNote.stock_voucher_number,
        },
        {
          $set: {
            'progress_state.$.isSync': true,
          },
        },
      ),
    );
  }

  updateSerials(deliveryNote, serial_no, settings) {
    if (deliveryNote.isSync) {
      return of(true);
    }
    if (
      deliveryNote.items[0].serial_no &&
      deliveryNote.stock_entry_type === STOCK_ENTRY_STATUS.delivered
    ) {
      deliveryNote.delivery_note = deliveryNote.stock_voucher_number;
      return this.updateSerialItem(deliveryNote, serial_no, settings);
    }
    deliveryNote.delivery_note = deliveryNote.stock_voucher_number;
    return from(
      this.serialService.updateOne(
        { serial_no: deliveryNote.items[0].serial_no },
        {
          $set: {
            delivery_note: deliveryNote.stock_voucher_number,
            warehouse: deliveryNote.set_warehouse,
          },
          $unset: {
            customer: '',
            'warranty.salesWarrantyDate': '',
            'warranty.soldOn': '',
            sales_invoice_name: '',
          },
        },
      ),
    );
  }

  checkDeliveryNoteState(deliveryNotesList) {
    const correctDeliveryNotes: WarrantyStockEntryDto[] = [];
    return from(deliveryNotesList).pipe(
      concatMap((deliveryNote: any) => {
        let query;
        if (deliveryNote.singleDeliveryNote.items[0].serial_no) {
          query = {
            uuid: deliveryNote.singleDeliveryNote.warrantyClaimUuid,
            completed_delivery_note: {
              $elemMatch: {
                'items.0.serial_no':
                  deliveryNote.singleDeliveryNote.items[0].serial_no,
                'items.0.item_code':
                  deliveryNote.singleDeliveryNote.items[0].item_code,
              },
            },
          };
        } else {
          query = {
            uuid: deliveryNote.singleDeliveryNote.warrantyClaimUuid,
            completed_delivery_note: {
              $elemMatch: {
                'items.0.item_code':
                  deliveryNote.singleDeliveryNote.items[0].item_code,
              },
            },
          };
        }
        return from(this.warrantyService.find(query)).pipe(
          switchMap(res => {
            if (!res.length) {
              correctDeliveryNotes.push(deliveryNote);
              return of();
            }
            return of();
          }),
        );
      }),
      toArray(),
      switchMap(() => {
        if (correctDeliveryNotes.length) {
          return of(correctDeliveryNotes);
        }
        return of([]);
      }),
    );
  }

  updateSerialItem(payload, serial_no, settings) {
    return from(
      this.warrantyService.findOne(
        { uuid: payload.warrantyClaimUuid },
        {
          progress_state: {
            $elemMatch: {
              items: {
                $elemMatch: {
                  serial_no,
                },
              },
            },
          },
        },
      ),
    ).pipe(
      switchMap(state => {
        return from(
          this.serialService.updateOne(
            { serial_no: payload.items[0].serial_no },
            {
              $set: {
                customer: state.progress_state[0].customer,
                'warranty.salesWarrantyDate': state.warranty_end_date
                  ? state.warranty_end_date
                  : '',
                'warranty.soldOn': new DateTime(settings.timeZone).toJSDate(),
                sales_invoice_name: state.progress_state[0].sales_invoice_name,
                delivery_note: payload.delivery_note,
              },
            },
          ),
        );
      }),
    );
  }

  setStockEntryDefaults(
    payload: WarrantyStockEntryDto,
    clientHttpRequest,
    settings: ServerSettings,
  ): StockEntry {
    const stockEntry = new StockEntry();
    Object.assign(stockEntry, payload);
    stockEntry.uuid = uuidv4();
    stockEntry.doctype = STOCK_ENTRY;
    stockEntry.createdOn = payload.posting_date;
    stockEntry.createdAt = new DateTime(settings.timeZone).toJSDate();
    stockEntry.createdByEmail = clientHttpRequest.token.email;
    stockEntry.createdBy = clientHttpRequest.token.fullName;
    stockEntry.stock_voucher_number = payload.stock_voucher_number;
    stockEntry.status = STOCK_ENTRY_STATUS.in_transit;
    stockEntry.isSynced = false;
    stockEntry.inQueue = true;
    stockEntry.docstatus = 1;
    return stockEntry;
  }

  removeStockEntry(stockEntry: WarrantyStockEntryDto, req) {
    let array_Value;
    if (typeof stockEntry.items[0]?.serial_no === 'string') {
      array_Value = stockEntry.items[0].serial_no;
    } else {
      array_Value = stockEntry.items[0]?.serial_no[0];
    }
    return this.stockEntryPoliciesService
      .validateCancelWarrantyStockEntry(
        stockEntry.warrantyClaimUuid,
        array_Value,
      )
      .pipe(
        switchMap(() => {
          if (array_Value !== NON_SERIAL_ITEM) {
            if (array_Value === 'Non serial Item') {
              this.stockEntryService.deleteOne({
                uuid: stockEntry.uuid,
              });
              this.warrantyService.updateOne(
                { uuid: stockEntry.warrantyClaimUuid },
                {
                  $unset: {
                    damage_product: '',
                    damage_warehouse: '',
                    damaged_serial: '',
                  },
                },
              );
            } else {
              if (
                stockEntry.stock_entry_type === STOCK_ENTRY_STATUS.delivered
              ) {
                if (typeof stockEntry.items[0]?.serial_no == 'string') {
                  const array_Update = [];
                  array_Update.push(stockEntry.items[0]?.serial_no);
                  return from(
                    this.serialService.updateMany(
                      {
                        serial_no: { $in: array_Update },
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
                  );
                } else {
                  return from(
                    this.serialService.updateMany(
                      {
                        serial_no: { $in: stockEntry.items[0]?.serial_no },
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
                  );
                }
              }
              if (stockEntry.stock_entry_type === STOCK_ENTRY_STATUS.returned) {
                return this.resetCancelledSerialItem(
                  stockEntry.stock_voucher_number,
                );
              }

              return of(true);
            }
          }
          return of(true);
        }),
        switchMap(() => {
          // DELETE SERIAL HISTORY OF WSD
          if (stockEntry.stock_entry_type === STOCK_ENTRY_STATUS.delivered) {
            this.warrantyService
              .findOne({
                uuid: stockEntry.warrantyClaimUuid,
              })
              .then(payload => {
                payload.progress_state.forEach(state => {
                  state.items.forEach(element => {
                    if (
                      element.stock_entry_type === STOCK_ENTRY_STATUS.delivered
                    ) {
                      this.serialNoHistoryService.deleteOne({
                        document_no: state.stock_voucher_number,
                      });
                    }
                  });
                });
              });
            return from(
              this.warrantyService.updateOne(
                { uuid: stockEntry.warrantyClaimUuid },
                {
                  $unset: {
                    replace_warehouse: '',
                    replace_product: '',
                    replace_serial: '',
                  },
                },
              ),
            );
          }
          // DELETE SERIAL HISTORY OF WSDR
          else if (
            stockEntry.stock_entry_type === STOCK_ENTRY_STATUS.returned
          ) {
            this.warrantyService
              .findOne({
                uuid: stockEntry.warrantyClaimUuid,
              })
              .then(payload => {
                payload.progress_state.forEach(state => {
                  state.items.forEach(element => {
                    if (
                      element.stock_entry_type === STOCK_ENTRY_STATUS.returned
                    ) {
                      this.serialNoHistoryService.deleteOne({
                        document_no: state.stock_voucher_number,
                      });
                    }
                  });
                });
              });
          }
          return of([]);
        }),
        switchMap(() => {
          return from(
            this.stockEntryService.deleteOne({
              uuid: stockEntry.uuid,
            }),
          );
        }),
        switchMap(() => {
          return this.revertStatusHistory(
            stockEntry.warrantyClaimUuid,
            stockEntry.customer,
            stockEntry.items[0]?.serial_no[0],
          );
        }),
        switchMap(() => {
          return from(
            this.warrantyService.updateOne(
              { uuid: stockEntry.warrantyClaimUuid },
              {
                $pull: {
                  completed_delivery_note: {
                    name: stockEntry.stock_voucher_number,
                  },
                  progress_state: {
                    stock_voucher_number: stockEntry.stock_voucher_number,
                  },
                },
              },
            ),
          );
        }),
        switchMap(() => {
          let flagValue;
          stockEntry.items.find(item => {
            flagValue = Object.keys(item).includes('excel_serials');
          });
          if (!flagValue) {
            if (
              stockEntry.items.find(item => {
                if (typeof item.serial_no == 'object') {
                  if (item.serial_no[0].toUpperCase() === NON_SERIAL_ITEM) {
                    return undefined;
                  }
                  return item.serial_no;
                } else {
                  if (item.serial_no === 'Non Serial Item') {
                    return undefined;
                  }
                  return item.serial_no;
                }
              })
            ) {
              return from(
                this.serialNoHistoryService.deleteOne({
                  document_no: stockEntry.stock_voucher_number,
                }),
              );
            }
          } else {
            if (
              stockEntry.items.find(item => {
                if (item.excel_serials.toUpperCase() === NON_SERIAL_ITEM) {
                  return undefined;
                }
                return item.excel_serials;
              })
            ) {
              return from(
                this.serialNoHistoryService.deleteOne({
                  document_no: stockEntry.stock_voucher_number,
                }),
              );
            }
          }
          return of(true);
        }),
        switchMap(() => {
          return this.settingService.find();
        }),
        switchMap(settings => {
          stockEntry.action = CANCEL_WARRANTY_STOCK_ENTRY;
          return this.createStockLedger(stockEntry, req.token, settings);
        }),
        // DELETING PROGRESS STATE ON CANCELLING ENTRIES
        switchMap(() => {
          const newState = [];
          return from(
            this.warrantyService
              .findOne({
                uuid: stockEntry.warrantyClaimUuid,
              })
              .then(payload => {
                payload.progress_state.forEach(state => {
                  newState.push(state);
                });
                const index = newState.findIndex(object => {
                  return (
                    object.stock_entry_type === stockEntry.stock_entry_type
                  );
                });
                newState.splice(index, 1);
                this.warrantyService.updateOne(
                  {
                    uuid: stockEntry.warrantyClaimUuid,
                  },
                  {
                    $set: { progress_state: newState },
                  },
                );
              }),
          );
        }),
      );
  }

  revertStatusHistory(uuid: string, customer: string, serial: any) {
    return from(
      this.warrantyService.findOne({
        uuid,
        status_history: {
          $elemMatch: {
            verdict: CURRENT_STATUS_VERDICT.DELIVER_TO_CUSTOMER,
          },
        },
      }),
    ).pipe(
      switchMap(res => {
        if (!res) {
          return of({});
        }
        return this.warrantyAggregateService.removeStatusHistory({ uuid });
      }),
    );
  }

  resetCancelledSerialItem(stock_voucher_number: string) {
    let stockEntryObject;
    return from(this.stockEntryService.findOne({ stock_voucher_number })).pipe(
      switchMap((stockEntry: any) => {
        stockEntryObject = stockEntry;
        return from(
          this.warrantyService.findOne({
            uuid: stockEntry.warrantyClaimUuid,
            claim_type: WARRANTY_TYPE.THIRD_PARTY,
          }),
        );
      }),
      switchMap(warranty => {
        if (!warranty) {
          if (typeof stockEntryObject.items[0]?.serial_no === 'string') {
            const array_Update = [];
            array_Update.push(stockEntryObject.items[0]?.serial_no);
            return from(
              this.serialService.updateMany(
                {
                  serial_no: { $in: array_Update },
                },
                {
                  $set: {
                    customer: stockEntryObject.items[0].customer,
                    warehouse: stockEntryObject.items[0].warehouse,
                    'warranty.salesWarrantyDate':
                      stockEntryObject.items[0].warranty.salesWarrantyDate,
                    'warranty.soldOn':
                      stockEntryObject.items[0].warranty.soldOn,
                    sales_invoice_name:
                      stockEntryObject.items[0].sales_invoice_name,
                    delivery_note: stockEntryObject.items[0].delivery_note,
                  },
                },
              ),
            );
          } else {
            return from(
              this.serialService.updateMany(
                {
                  serial_no: { $in: stockEntryObject.items[0]?.serial_no },
                },
                {
                  $set: {
                    customer: stockEntryObject.items[0].customer,
                    warehouse: stockEntryObject.items[0].warehouse,
                    'warranty.salesWarrantyDate':
                      stockEntryObject.items[0].warranty.salesWarrantyDate,
                    'warranty.soldOn':
                      stockEntryObject.items[0].warranty.soldOn,
                    sales_invoice_name:
                      stockEntryObject.items[0].sales_invoice_name,
                    delivery_note: stockEntryObject.items[0].delivery_note,
                  },
                },
              ),
            );
          }
        }
        if (typeof stockEntryObject.items[0]?.serial_no === 'string') {
          const array_Update = [];
          array_Update.push(stockEntryObject.items[0]?.serial_no);
          return from(
            this.serialService.deleteOne({
              serial_no: { $in: array_Update },
            }),
          );
        } else {
          return from(
            this.serialService.updateOne(
              {
                serial_no: { $in: stockEntryObject.items[0]?.serial_no },
              },
              {
                $set: {
                  'warranty.salesWarrantyDate': warranty.received_on,
                  'warranty.soldOn': warranty.received_on,
                },
                $unset: {
                  delivery_note: '',
                },
              },
            ),
          );
        }
      }),
    );
  }

  // assigning stock id function
  getAssignStockId(stockPayload: StockEntry) {
    return this.settingService.find().pipe(
      switchMap(serverSettings => {
        const date = new DateTime(serverSettings.timeZone).year;
        let $match: any;
        if (stockPayload.stock_entry_type === STOCK_ENTRY_STATUS.returned) {
          $match = {
            stock_entry_type: STOCK_ENTRY_STATUS.returned,
          };
        } else if (
          stockPayload.stock_entry_type === STOCK_ENTRY_STATUS.delivered
        ) {
          $match = {
            stock_entry_type: STOCK_ENTRY_STATUS.delivered,
          };
        }
        const $sort: any = {
          createdAt: -1,
        };
        const $limit: any = 1;
        return this.stockEntryService
          .asyncAggregate([{ $match }, { $sort }, { $limit }])
          .pipe(
            map((result: any) => {
              const myArray = result[0].stock_id.split('-');
              const incrementor = Number(myArray[2]) + 1;
              if (
                stockPayload.stock_entry_type === STOCK_ENTRY_STATUS.returned
              ) {
                stockPayload.stock_id = `WSDR-${date}-${incrementor}`;
              } else if (
                stockPayload.stock_entry_type === STOCK_ENTRY_STATUS.delivered
              ) {
                stockPayload.stock_id = `WSD-${date}-${incrementor}`;
              }
              return stockPayload;
            }),
          );
      }),
    );
  }
}
