import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  NotImplementedException,
  HttpService,
} from '@nestjs/common';
import { StockEntryService } from '../../entities/stock-entry.service';
import { StockEntryDto } from '../../entities/stock-entry-dto';
import { StockEntryPoliciesService } from '../../policies/stock-entry-policies/stock-entry-policies.service';
import {
  switchMap,
  mergeMap,
  concatMap,
  toArray,
  catchError,
  map,
} from 'rxjs/operators';
import { StockEntry, StockEntryItem } from '../../entities/stock-entry.entity';
import { from, throwError, of, forkJoin } from 'rxjs';
import {
  STOCK_ENTRY,
  FRAPPE_QUEUE_JOB,
  STOCK_ENTRY_STATUS,
  CREATE_STOCK_ENTRY_JOB,
  // ACCEPT_STOCK_ENTRY_JOB,
  // REJECT_STOCK_ENTRY_JOB,
  AUTHORIZATION,
  BEARER_HEADER_VALUE_PREFIX,
  STOCK_OPERATION,
  STOCK_MATERIAL_TRANSFER,
  ACCEPT_STOCK_ENTRY_JOB,
  REJECT_STOCK_ENTRY_JOB,
  APPLICATION_JSON_CONTENT_TYPE,
} from '../../../constants/app-strings';
import { v4 as uuidv4 } from 'uuid';
import * as Agenda from 'agenda';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';
import {
  INVALID_FILE,
  STOCK_ENTRY_TYPE,
  AGENDA_JOB_STATUS,
  DOC_NAMES,
} from '../../../constants/app-strings';
import { DateTime } from 'luxon';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';

import {
  FRAPPE_CLIENT_CANCEL,
  POST_STOCK_PRINT_ENDPOINT,
} from '../../../constants/routes';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import { getUserPermissions } from '../../../constants/agenda-job';
import { StockEntrySyncService } from '../../../stock-entry/schedular/stock-entry-sync/stock-entry-sync.service';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';
import { StockLedger } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.entity';

@Injectable()
export class StockEntryAggregateService {
  constructor(
    @Inject(AGENDA_TOKEN)
    private readonly agenda: Agenda,
    private readonly stockEntryService: StockEntryService,
    private readonly stockEntryPolicies: StockEntryPoliciesService,
    private readonly http: HttpService,
    private readonly settingService: SettingsService,
    private readonly serialHistoryService: SerialNoHistoryService,
    private readonly serialNoService: SerialNoService,
    private readonly stockEntrySyncService: StockEntrySyncService,
    private readonly stockLedgerService: StockLedgerService,
  ) {}

  createStockEntry(payload: StockEntryDto, req) {
    return this.parseStockEntryPayload(payload).pipe(
      switchMap((response: any) => {
        payload = response;
        const settings = this.settingService.find();
        if (payload.status === STOCK_ENTRY_STATUS.draft || !payload.uuid) {
          return this.stockEntryPolicies
            .validateStockPermission(
              payload.stock_entry_type,
              STOCK_OPERATION.create,
              req,
            )
            .pipe(
              switchMap(() => this.saveDraft(payload, req)),
              catchError(err => {
                return err;
              }),
            );
        }
        return this.stockEntryPolicies
          .validateStockPermission(
            payload.stock_entry_type,
            STOCK_OPERATION.submit,
            req,
          )
          .pipe(
            switchMap(() =>
              this.stockEntryPolicies.validateStockEntry(payload),
            ),
            switchMap(() => {
              return from(
                this.stockEntryService.updateOne(
                  { uuid: payload.uuid },
                  {
                    $set: {
                      stock_id: payload.stock_id,
                    },
                  },
                ),
              );
            }),
            switchMap(() => {
              return from(
                this.stockEntryService.findOne({ uuid: payload.uuid }),
              );
            }),
            switchMap(stockEntry => {
              stockEntry.stock_id = payload.stock_id;
              if (!stockEntry) {
                return throwError(
                  new BadRequestException('Stock Entry not found'),
                );
              }
              const mongoSerials: SerialHash = this.getStockEntryMongoSerials(
                stockEntry,
              );

              if (
                stockEntry.stock_entry_type ===
                STOCK_ENTRY_TYPE.MATERIAL_RECEIPT
              ) {
                if (mongoSerials && mongoSerials.length) {
                  return this.createMongoSerials(
                    stockEntry,
                    mongoSerials,
                    req,
                    settings,
                  );
                }
              }

              if (!mongoSerials) {
                settings
                  .pipe(
                    switchMap(settings => {
                      return this.stockEntrySyncService.createStockEntry({
                        payload: stockEntry,
                        token: req.token,
                        type: CREATE_STOCK_ENTRY_JOB,
                        parent: stockEntry.uuid,
                        settings,
                      });
                    }),
                  )
                  .subscribe();
                return of(stockEntry);
              }

              return from(Object.keys(mongoSerials)).pipe(
                mergeMap(key => {
                  return from(
                    this.serialNoService.updateOne(
                      { serial_no: { $in: mongoSerials[key].serial_no } },
                      {
                        $set: {
                          queue_state: {
                            stock_entry: {
                              parent: stockEntry.uuid,
                              warehouse: mongoSerials[key].t_warehouse,
                            },
                          },
                        },
                      },
                    ),
                  );
                }),
                toArray(),
                switchMap(() => {
                  return settings.pipe(
                    switchMap(settings => {
                      return this.stockEntrySyncService.createStockEntry({
                        payload: stockEntry,
                        token: req.token,
                        type: CREATE_STOCK_ENTRY_JOB,
                        parent: stockEntry.uuid,
                        settings,
                      });
                    }),
                  );
                }),
                switchMap(() => {
                  return of(stockEntry);
                }),
              );
            }),
            switchMap(stockEntry => {
              return from(
                this.stockEntryService.updateOne(
                  { uuid: stockEntry.uuid },
                  {
                    $set: {
                      status:
                        payload.stock_entry_type ===
                        STOCK_ENTRY_TYPE.MATERIAL_TRANSFER
                          ? STOCK_ENTRY_STATUS.in_transit
                          : STOCK_ENTRY_STATUS.delivered,
                    },
                  },
                ),
              );
            }),
          );
      }),
    );
  }

  createMongoSerials(stockEntry: StockEntry, mongoSerials: any, req, settings) {
    return of({}).pipe(
      switchMap(obj => {
        return from(
          this.serialNoService.insertMany(mongoSerials, { ordered: false }),
        ).pipe(
          switchMap(success => {
            settings
              .pipe(
                switchMap(settings => {
                  return this.stockEntrySyncService.createStockEntry({
                    payload: stockEntry,
                    token: req.token,
                    type: CREATE_STOCK_ENTRY_JOB,
                    parent: stockEntry.uuid,
                    settings,
                  });
                }),
              )
              .subscribe();
            return of(stockEntry);
          }),
        );
      }),
      catchError(err => {
        return this.stockEntryPolicies.validateStockEntryQueue(stockEntry).pipe(
          switchMap(() => {
            const serials = [];
            mongoSerials.forEach(entry => serials.push(entry.serial_no));
            this.serialNoService
              .deleteMany({
                serial_no: { $in: serials },
                'queue_state.stock_entry.parent': stockEntry.uuid,
              })
              .then(success => {})
              .catch(err => {});
            return throwError(
              new BadRequestException(
                'Error occurred while adding serials to mongo, please try again.',
              ),
            );
          }),
        );
      }),
    );
  }

  parseStockEntryPayload(payload: StockEntryDto) {
    return this.settingService.find().pipe(
      switchMap(serverSettings => {
        const date = new DateTime(serverSettings.timeZone).year;
        let $match: any;
        if (payload.stock_entry_type === 'Material Issue') {
          $match = {
            stock_entry_type: 'Material Issue',
          };
        } else if (payload.stock_entry_type === 'Material Receipt') {
          $match = {
            stock_entry_type: 'Material Receipt',
          };
        } else if (payload.stock_entry_type === 'R&D Products') {
          $match = {
            stock_entry_type: 'R&D Products',
          };
        } else if (payload.stock_entry_type === 'Material Transfer') {
          $match = {
            stock_entry_type: 'Material Transfer',
          };
        }
        return this.stockEntryService.asyncAggregate([{ $match }]).pipe(
          map((result: any) => {
            const maxArray = [];
            for (const data of result) {
              const myArray = data.stock_id.split('-');
              if (myArray.length === 3) {
                maxArray.push(Number(myArray[2]));
              }
            }
            const myArray = Math.max(...maxArray);
            const incrementer = Number(myArray) + 1;
            let stockid: any;
            if (payload.stock_entry_type === 'Material Transfer') {
              stockid = `TROUT-${date}-${incrementer}`;
            } else if (payload.stock_entry_type === 'Material Receipt') {
              stockid = `PAQ-${date}-${incrementer}`;
            } else if (payload.stock_entry_type === 'Material Issue') {
              stockid = `PCM-${date}-${incrementer}`;
            } else if ((payload.stock_entry_type = 'R&D Products')) {
              stockid = `RND-${date}-${incrementer}`;
            }
            payload.stock_id = stockid;
            switch (payload.stock_entry_type) {
              case STOCK_ENTRY_TYPE.MATERIAL_RECEIPT:
                return payload;

              case STOCK_ENTRY_TYPE.MATERIAL_ISSUE:
                payload.items.filter(item => {
                  delete item.basic_rate;
                  return item;
                });
                return payload;

              case STOCK_ENTRY_TYPE.MATERIAL_TRANSFER:
                payload.items.filter(item => {
                  delete item.basic_rate;
                  return item;
                });
                return payload;

              default:
                return payload;
            }
          }),
        );
      }),
    );
  }

  getStockEntryMongoSerials(stockEntry) {
    let mongoSerials;
    stockEntry.items.forEach(item => {
      if (!item.has_serial_no) return;
      item.serial_no.forEach(serial_no => {
        if (stockEntry.stock_entry_type === STOCK_ENTRY_TYPE.MATERIAL_RECEIPT) {
          if (!mongoSerials) mongoSerials = [];
          mongoSerials.push({
            serial_no,
            item_code: item.item_code,
            item_name: item.item_name,
            company: stockEntry.company,
            queue_state: {
              stock_entry: {
                parent: stockEntry.uuid,
                warehouse: item.t_warehouse,
              },
            },
          });
          return;
        }
        if (!mongoSerials) mongoSerials = {};
        if (mongoSerials[item.item_code]) {
          mongoSerials[item.item_code].serial_no.push(serial_no);
        } else {
          mongoSerials[item.item_code] = { serial_no: [serial_no] };
          mongoSerials[item.item_code].t_warehouse = item.t_warehouse;
        }
      });
    });
    return mongoSerials;
  }

  getStockBalance(payload: { item_code: string; warehouse: string }) {
    return this.stockLedgerService
      .asyncAggregate([
        {
          $match: {
            item_code: JSON.parse(decodeURIComponent(payload.item_code)),
            warehouse: payload.warehouse,
          },
        },
        {
          $group: { _id: null, sum: { $sum: '$actual_qty' } },
        },
        { $project: { sum: 1 } },
      ])
      .pipe(
        switchMap((stockCount: [{ sum: number }]) => {
          if (stockCount.length) {
            return of(stockCount.find(summedData => summedData).sum);
          }
          return of(0);
        }),
      );
  }

  async deleteDraft(uuid: string, req) {
    const stockEntry = await this.stockEntryService.findOne({ uuid });
    if (!stockEntry) {
      throw new BadRequestException('Stock Entry Not Found');
    }
    if (stockEntry.status !== STOCK_ENTRY_STATUS.draft) {
      throw new BadRequestException(
        `Stock Entry with status ${stockEntry.status}, cannot be deleted.`,
      );
    }
    await this.stockEntryPolicies
      .validateStockPermission(
        stockEntry.stock_entry_type,
        STOCK_OPERATION.delete,
        req,
      )
      .toPromise();
    await this.stockEntryService.deleteOne({ uuid });
    return true;
  }

  resetStockEntry(uuid: string, req) {
    let serverSettings: ServerSettings;
    return from(this.stockEntryService.findOne({ uuid })).pipe(
      switchMap(stockEntry => {
        return this.stockEntryPolicies
          .validateStockPermission(
            stockEntry.stock_entry_type,
            STOCK_OPERATION.delete,
            req,
          )
          .pipe(switchMap(() => of(stockEntry)));
      }),
      switchMap(stockEntry => {
        if (!stockEntry) {
          return throwError(new NotFoundException('Stock Entry not found'));
        }
        return forkJoin({
          stockEntry: this.stockEntryPolicies.validateStockEntryCancel(
            stockEntry,
          ),
          // stockEntryQueue: this.stockEntryPolicies.validateStockEntryQueue(stockEntry),
          settings: this.settingService.find(),
        });
      }),
      switchMap(({ stockEntry, settings }) => {
        serverSettings = settings;
        return of(stockEntry);
        // return this.cancelERPNextDocument(stockEntry, settings, req);
      }),
      switchMap(stockEntry => {
        return forkJoin({
          serialReset: this.resetStockEntrySerial(stockEntry),
          serialHistoryReset: this.resetStockEntrySerialHistory(stockEntry),
        }).pipe(
          switchMap(success => this.updateStockEntryReset(stockEntry)),
          switchMap(() => {
            if (stockEntry.stock_entry_type === 'Material Transfer') {
              return this.createTransferStockEntryLedger(
                stockEntry,
                req.token,
                serverSettings,
                's_warehouse',
              ).pipe(
                switchMap(() => {
                  return this.createTransferStockEntryLedger(
                    stockEntry,
                    req.token,
                    serverSettings,
                    't_warehouse',
                  );
                }),
              );
            }
            return this.createTransferStockEntryLedger(
              stockEntry,
              req.token,
              serverSettings,
            );
          }),
        );
      }),
    );
  }

  createTransferStockEntryLedger(
    payload: StockEntry,
    token,
    settings,
    warehouse_type?,
  ) {
    return from(payload.items).pipe(
      concatMap((item: StockEntryItem) => {
        if (payload.stock_entry_type === 'Material Issue') {
          warehouse_type = 's_warehouse';
        }
        if (payload.stock_entry_type === 'R&D Products') {
          warehouse_type = 's_warehouse';
        }
        if (payload.stock_entry_type === 'Material Receipt') {
          warehouse_type = 't_warehouse';
        }
        return this.createStockLedgerPayload(
          payload.naming_series,
          item,
          token,
          settings,
          warehouse_type,
        ).pipe(
          switchMap((response: StockLedger) => {
            return from(this.stockLedgerService.create(response));
          }),
        );
      }),
    );
  }

  createStockLedgerPayload(
    stock_entry_no: string,
    deliveryNoteItem: StockEntryItem,
    token,
    settings: ServerSettings,
    warehouse_type?,
  ) {
    return this.settingService.getFiscalYear(settings).pipe(
      switchMap(fiscalYear => {
        const date = new DateTime(settings.timeZone).toJSDate();
        const stockPayload = new StockLedger();
        stockPayload.name = uuidv4();
        stockPayload.modified = date;
        stockPayload.modified_by = token.email;
        stockPayload.item_code = deliveryNoteItem.item_code;
        stockPayload.actual_qty =
          warehouse_type === 't_warehouse'
            ? -deliveryNoteItem.qty
            : deliveryNoteItem.qty;
        stockPayload.valuation_rate = deliveryNoteItem.basic_rate
          ? deliveryNoteItem.basic_rate
          : 0;
        stockPayload.batch_no = '';
        stockPayload.posting_date = date;
        stockPayload.posting_time = date;
        stockPayload.voucher_type = STOCK_MATERIAL_TRANSFER;
        stockPayload.voucher_no = stock_entry_no;
        stockPayload.voucher_detail_no = '';
        stockPayload.incoming_rate = 0;
        stockPayload.outgoing_rate = 0;
        stockPayload.qty_after_transaction = stockPayload.actual_qty;
        if (warehouse_type === 't_warehouse') {
          stockPayload.warehouse = deliveryNoteItem.t_warehouse;
        }
        if (warehouse_type === 's_warehouse') {
          stockPayload.warehouse = deliveryNoteItem.s_warehouse;
        }
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
  cancelERPNextDocument(stockEntry: StockEntry, settings: ServerSettings, req) {
    return from(stockEntry.names.reverse()).pipe(
      concatMap(docName => {
        const doctypeName =
          stockEntry.stock_entry_type === STOCK_ENTRY_TYPE.RnD_PRODUCTS
            ? DOC_NAMES.DELIVERY_NOTE
            : DOC_NAMES.STOCK_ENTRY;
        return this.cancelDoc(doctypeName, docName, settings, req);
      }),
      catchError(err => {
        if (
          err?.response?.data?.exc &&
          err?.response?.data?.exc.includes('Cannot edit cancelled document')
        ) {
          return of(true);
        }
        return throwError(new BadRequestException(err));
      }),
      toArray(),
      switchMap(success => {
        return of(stockEntry);
      }),
    );
  }

  saveDraft(payload: StockEntryDto, req) {
    if (payload.uuid) {
      payload.stock_id = payload.uuid;
      return from(
        this.stockEntryService.updateOne(
          { uuid: payload.uuid },
          { $set: payload },
        ),
      ).pipe(switchMap(data => of(payload)));
    }
    return this.settingService.find().pipe(
      switchMap(settings => {
        const stockEntry = this.setStockEntryDefaults(payload, req, settings);
        stockEntry.status = STOCK_ENTRY_STATUS.draft;
        stockEntry.stock_id = stockEntry.uuid;
        return from(this.stockEntryService.create(stockEntry)).pipe(
          switchMap(data => of(stockEntry)),
          catchError(err => {
            return throwError(err);
          }),
        );
      }),
    );
  }

  setStockEntryDefaults(
    payload: StockEntryDto,
    clientHttpRequest,
    settings: ServerSettings,
  ): StockEntry {
    const stockEntry = new StockEntry();
    Object.assign(stockEntry, payload);
    delete stockEntry.names;
    stockEntry.uuid = uuidv4();
    stockEntry.doctype = STOCK_ENTRY;
    stockEntry.set_posting_time = 1;
    stockEntry.createdOn = payload.posting_date;
    stockEntry.createdAt = new DateTime(settings.timeZone).toJSDate();
    stockEntry.createdByEmail = clientHttpRequest.token.email;
    stockEntry.createdBy = clientHttpRequest.token.fullName;
    stockEntry.status = STOCK_ENTRY_STATUS.in_transit;
    stockEntry.isSynced = false;
    stockEntry.inQueue = true;
    stockEntry.docstatus = 1;
    return stockEntry;
  }

  addToQueueNow(
    data: {
      payload: any;
      token: any;
      type: string;
      parent?: string;
      status?: string;
    },
    parentUuid: string,
  ) {
    data.parent = parentUuid;
    data.status = AGENDA_JOB_STATUS.in_queue;
    return this.agenda.now(FRAPPE_QUEUE_JOB, data);
  }

  StockEntryFromFile(file, req) {
    return from(this.getJsonData(file)).pipe(
      switchMap((data: StockEntryDto) => {
        if (!data) {
          return throwError(new BadRequestException(INVALID_FILE));
        }
        return this.createStockEntry(data, req);
      }),
    );
  }

  getJsonData(file) {
    return of(JSON.parse(file.buffer));
  }

  getStockEntryList(offset, limit, sort, filter_query, req) {
    return this.stockEntryService.list(
      offset,
      limit,
      sort,
      getUserPermissions(req),
      filter_query,
    );
  }

  getStockEntry(uuid: string, req) {
    return from(this.stockEntryService.findOne({ uuid })).pipe(
      switchMap(stockEntry => {
        if (!stockEntry) {
          return throwError(new BadRequestException('Stock Entry Not Found'));
        }
        return this.stockEntryPolicies
          .validateStockPermission(
            stockEntry.stock_entry_type,
            STOCK_OPERATION.read,
            req,
          )
          .pipe(switchMap(() => of(stockEntry)));
      }),
      switchMap(stockEntry => {
        if (stockEntry.status !== STOCK_ENTRY_STATUS.draft) {
          stockEntry.items.filter(item => {
            // if (item.serial_no && item.serial_no.length) {
            //   item.serial_no = [
            //     item.serial_no[0],
            //     item.serial_no[item.serial_no.length - 1],
            //   ];
            // }

            return item;
          });
        }
        return of(stockEntry);
      }),
    );
  }

  rejectStockEntry(uuid: string, req) {
    const settings = this.settingService.find();
    return from(this.stockEntryService.findOne({ uuid })).pipe(
      switchMap(stockEntry => {
        if (!stockEntry) {
          return throwError(new BadRequestException('Stock Entry Not Found'));
        }
        return this.stockEntryPolicies
          .validateStockPermission(
            stockEntry.stock_entry_type,
            STOCK_OPERATION.delete,
            req,
          )
          .pipe(switchMap(() => of(stockEntry)));
      }),
      switchMap(stockEntry => {
        return forkJoin({
          validateSerialState: this.stockEntryPolicies.validateSerialState(
            stockEntry,
          ),
          validateJobState: this.stockEntryPolicies.validateStockEntryQueue(
            stockEntry,
          ),
        }).pipe(switchMap(success => of(stockEntry)));
      }),
      mergeMap(stockEntry => {
        if (!stockEntry) {
          return throwError(new BadRequestException('Stock Entry not found.'));
        }
        // const payload: any = this.removeStockEntryFields(stockEntry);
        this.stockEntryService
          .updateOne(
            { uuid },
            { $set: { status: STOCK_ENTRY_STATUS.returned } },
          )
          .catch(err => {})
          .then(success => {});
        settings
          .pipe(
            switchMap(settings => {
              return this.stockEntrySyncService.createStockEntry({
                payload: stockEntry,
                token: req.token,
                type: REJECT_STOCK_ENTRY_JOB,
                parent: stockEntry.uuid,
                settings,
              });
            }),
          )
          .subscribe();
        return of(stockEntry);
      }),
    );
  }

  // removeStockEntryFields(stockEntry: StockEntry) {
  //   delete stockEntry.names;
  //   delete stockEntry.createdAt;
  //   return stockEntry;
  // }

  acceptStockEntry(uuid: string, req) {
    const settings = this.settingService.find();
    return from(this.stockEntryService.findOne({ uuid })).pipe(
      switchMap(stockEntry => {
        return this.stockEntryPolicies
          .validateStockPermission(
            stockEntry.stock_entry_type,
            STOCK_OPERATION.accept,
            req,
          )
          .pipe(switchMap(() => of(stockEntry)));
      }),
      switchMap(stockEntry => {
        return forkJoin({
          validateSerialState: this.stockEntryPolicies.validateSerialState(
            stockEntry,
          ),
          validateJobState: this.stockEntryPolicies.validateStockEntryQueue(
            stockEntry,
          ),
        }).pipe(switchMap(success => of(stockEntry)));
      }),
      mergeMap(stockEntry => {
        if (!stockEntry) {
          return throwError(new BadRequestException('Stock Entry not found.'));
        }
        // const payload: any = this.removeStockEntryFields(stockEntry);
        this.stockEntryService
          .updateOne(
            { uuid },
            { $set: { status: STOCK_ENTRY_STATUS.delivered } },
          )
          .catch(err => {})
          .then(success => {});
        settings
          .pipe(
            switchMap(settings => {
              return this.stockEntrySyncService.createStockEntry({
                payload: stockEntry,
                token: req.token,
                type: ACCEPT_STOCK_ENTRY_JOB,
                parent: stockEntry.uuid,
                settings,
              });
            }),
          )
          .subscribe();
        return of(stockEntry);
      }),
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

  updateStockEntryReset(stockEntry: StockEntry) {
    return from(
      this.stockEntryService.updateOne(
        { uuid: stockEntry.uuid },
        {
          $set: {
            status: STOCK_ENTRY_STATUS.reseted,
          },
        },
      ),
    );
  }

  resetStockEntrySerial(stockEntry: StockEntry) {
    switch (stockEntry.stock_entry_type) {
      case STOCK_ENTRY_TYPE.MATERIAL_RECEIPT:
        return from(
          this.serialNoService.deleteMany({
            purchase_invoice_name: stockEntry.uuid,
          }),
        );

      case STOCK_ENTRY_TYPE.MATERIAL_ISSUE:
        return this.resetMaterialIssueSerials(stockEntry);

      case STOCK_ENTRY_TYPE.RnD_PRODUCTS:
        return this.resetMaterialIssueSerials(stockEntry);

      case STOCK_ENTRY_TYPE.MATERIAL_TRANSFER:
        return this.resetMaterialTransfer(stockEntry);

      default:
        return throwError(new BadRequestException('Invalid Stock Entry type.'));
    }
  }

  resetMaterialTransfer(stockEntry: StockEntry) {
    return from(stockEntry.items).pipe(
      concatMap(item => {
        if (!item.has_serial_no) {
          return of(true);
        }
        return from(
          this.serialNoService.updateMany(
            {
              serial_no: { $in: item.serial_no },
            },
            {
              $set: { warehouse: item.s_warehouse },
            },
          ),
        );
      }),
    );
  }

  resetMaterialIssueSerials(stockEntry: StockEntry) {
    return from(stockEntry.items).pipe(
      concatMap(item => {
        if (!item.has_serial_no) {
          return of(true);
        }
        return from(
          this.serialNoService.updateMany(
            {
              serial_no: { $in: item.serial_no },
            },
            {
              $set: {
                warehouse: item.s_warehouse,
              },
              $unset: {
                sales_document_type: null,
                sales_document_no: null,
                sales_invoice_name: null,
                'warranty.salesWarrantyDate': null,
                'warranty.soldOn': null,
              },
            },
          ),
        );
      }),
    );
  }

  resetStockEntrySerialHistory(stockEntry: StockEntry) {
    switch (stockEntry.stock_entry_type) {
      case STOCK_ENTRY_TYPE.MATERIAL_RECEIPT:
        return from(
          this.serialHistoryService.deleteMany({
            parent_document: stockEntry.uuid,
          }),
        );

      case STOCK_ENTRY_TYPE.MATERIAL_ISSUE:
        return from(
          this.serialHistoryService.deleteMany({
            parent_document: stockEntry.uuid,
          }),
        );

      case STOCK_ENTRY_TYPE.RnD_PRODUCTS:
        return from(
          this.serialHistoryService.deleteMany({
            parent_document: stockEntry.uuid,
          }),
        );

      case STOCK_ENTRY_TYPE.MATERIAL_TRANSFER:
        return from(
          this.serialHistoryService.deleteMany({
            parent_document: stockEntry.uuid,
          }),
        );

      default:
        return throwError(new BadRequestException('Invalid Stock Entry type.'));
    }
  }

  getStockEntryDeliveredSerials(offset, limit, search, uuid, req) {
    return from(this.stockEntryService.findOne({ uuid })).pipe(
      switchMap(stockEntry => {
        if (!stockEntry) {
          return throwError(new NotFoundException('Stock Entry not found.'));
        }
        const serials = [];
        const regex = new RegExp(search, 'i');
        stockEntry.items.forEach(item => {
          if (item.has_serial_no) {
            if (search && search !== '') {
              item.serial_no.forEach(eachSerial =>
                regex.test(eachSerial) ? serials.push(eachSerial) : null,
              );
            } else {
              serials.push(...item.serial_no);
            }
          }
        });

        const serialNoQuery: any = { serial_no: { $in: serials } };

        return forkJoin({
          docs: this.serialNoService.aggregateList(
            offset,
            limit,
            serialNoQuery,
          ),
          length: of(serials.length),
          offset: of(offset),
        });
      }),
    );
  }

  syncStockEntryDocument(req, stockPrintBody) {
    let url: string = '';
    return this.settingService.find().pipe(
      switchMap(setting => {
        if (!setting.authServerURL) {
          return throwError(new NotImplementedException());
        }
        url = `${setting.authServerURL}${POST_STOCK_PRINT_ENDPOINT}`;
        return this.http.get(`${url}/${stockPrintBody.uuid}`, {
          headers: {
            authorization: req.body.headers.Authorization,
            Accept: APPLICATION_JSON_CONTENT_TYPE,
          },
        });
      }),
      map(res => res.data),
      switchMap(() => {
        return this.http.put(`${url}/${stockPrintBody.uuid}`, stockPrintBody, {
          headers: {
            authorization: req.body.headers.Authorization,
            Accept: APPLICATION_JSON_CONTENT_TYPE,
          },
        });
      }),
      map(res => res.data),
      catchError(err => {
        if (err.response.status === 404) {
          return this.http.post(url, stockPrintBody, {
            headers: {
              authorization: req.body.headers.Authorization,
              Accept: APPLICATION_JSON_CONTENT_TYPE,
            },
          });
        }
        return throwError(new BadRequestException(err.response.statusText));
      }),
      map(res => res.data),
    );
  }
}

export interface SerialHash {
  [key: string]: { serial_no: string[]; t_warehouse: string };
}
