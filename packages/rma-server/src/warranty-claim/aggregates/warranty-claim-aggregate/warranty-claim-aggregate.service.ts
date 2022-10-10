import {
  Injectable,
  NotFoundException,
  BadRequestException,
  NotImplementedException,
  HttpService,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import {
  WarrantyBulkProducts,
  WarrantyClaim,
} from '../../entity/warranty-claim/warranty-claim.entity';
import { WarrantyClaimService } from '../../entity/warranty-claim/warranty-claim.service';
import { WarrantyClaimRemovedEvent } from '../../event/warranty-claim-removed/warranty-claim-removed.event';
import { WarrantyClaimUpdatedEvent } from '../../event/warranty-claim-updated/warranty-claim-updated.event';
import { UpdateWarrantyClaimDto } from '../../entity/warranty-claim/update-warranty-claim-dto';
import { from, throwError, of, forkJoin } from 'rxjs';
import { switchMap, map, concatMap, toArray, catchError } from 'rxjs/operators';

import {
  INVALID_FILE,
  VERDICT,
  CLAIM_STATUS,
  WARRANTY_CLAIM_DOCTYPE,
  CATEGORY,
  APPLICATION_JSON_CONTENT_TYPE,
  STOCK_ENTRY_STATUS,
} from '../../../constants/app-strings';
import {
  BulkWarrantyClaimInterface,
  BulkWarrantyClaim,
} from '../../entity/warranty-claim/create-bulk-warranty-claim.interface';
import { WarrantyClaimPoliciesService } from '../../policies/warranty-claim-policies/warranty-claim-policies.service';
import { SerialNoAggregateService } from '../../../serial-no/aggregates/serial-no-aggregate/serial-no-aggregate.service';
import { SerialNoDto } from '../../../serial-no/entity/serial-no/serial-no-dto';
import { BulkWarrantyClaimsCreatedEvent } from '../../event/bulk-warranty-claims-created/bulk-warranty-claims.event';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { WARRANTY_TYPE, DELIVERY_STATUS } from '../../../constants/app-strings';
import { DateTime } from 'luxon';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { CLAIM_TYPE_INVALID } from '../../../constants/messages';
import { WarrantyClaimDto } from '../../../warranty-claim/entity/warranty-claim/warranty-claim-dto';
import { StatusHistoryDto } from '../../entity/warranty-claim/status-history-dto';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import {
  SerialNoHistoryInterface,
  EventType,
} from '../../../serial-no/entity/serial-no-history/serial-no-history.entity';
import { POST_WARRANTY_PRINT_ENDPOINT } from '../../../constants/routes';
import { WarrantyPrintDetails } from '../../../print/entities/print/print.dto';

@Injectable()
export class WarrantyClaimAggregateService extends AggregateRoot {
  constructor(
    private readonly warrantyClaimService: WarrantyClaimService,
    private readonly warrantyClaimsPoliciesService: WarrantyClaimPoliciesService,
    private readonly serialNoAggregateService: SerialNoAggregateService,
    private readonly serialNoService: SerialNoService,
    private readonly settingsService: SettingsService,
    private readonly serialNoHistoryService: SerialNoHistoryService,
    private readonly http: HttpService,
  ) {
    super();
  }

  createClaim(warrantyClaimPayload: WarrantyClaimDto, clientHttpRequest) {
    if (warrantyClaimPayload.category === CATEGORY.BULK) {
      return this.createBulkClaim(warrantyClaimPayload, clientHttpRequest);
    } else {
      return this.addWarrantyClaim(warrantyClaimPayload, clientHttpRequest);
    }
  }

  addWarrantyClaim(warrantyClaimPayload: WarrantyClaimDto, clientHttpRequest) {
    warrantyClaimPayload.status_history = [];
    warrantyClaimPayload.status_history.push({
      status: clientHttpRequest.token.fullName,
      posting_date: warrantyClaimPayload.received_on,
      time: warrantyClaimPayload.posting_time,
      verdict: VERDICT.RECEIVED_FROM_CUSTOMER,
      status_from: warrantyClaimPayload.receiving_branch,
      transfer_branch: '',
      description: '',
      delivery_status: '',
      created_by_email: clientHttpRequest.token.email,
      created_by: clientHttpRequest.token.fullName,
    });
    switch (warrantyClaimPayload.claim_type) {
      case WARRANTY_TYPE.WARRANTY:
        return this.createWarrantyNonWarrantyClaim(
          warrantyClaimPayload,
          clientHttpRequest,
        ).pipe(
          catchError(err => {
            return throwError(new BadRequestException(err));
          }),
        );

      case WARRANTY_TYPE.NON_WARRANTY:
        return this.createWarrantyNonWarrantyClaim(
          warrantyClaimPayload,
          clientHttpRequest,
        ).pipe(
          catchError(err => {
            return throwError(new BadRequestException(err));
          }),
        );

      case WARRANTY_TYPE.NON_SERIAL:
        return this.createNonSerialClaim(
          warrantyClaimPayload,
          clientHttpRequest,
        ).pipe(
          catchError(err => {
            return throwError(new BadRequestException(err));
          }),
        );

      case WARRANTY_TYPE.THIRD_PARTY:
        return this.createThirdPartyClaim(
          warrantyClaimPayload,
          clientHttpRequest,
        ).pipe(
          catchError(err => {
            return throwError(new BadRequestException(err));
          }),
        );

      default:
        return throwError(new NotImplementedException(CLAIM_TYPE_INVALID));
    }
  }

  assignFields(warrantyClaimPayload: WarrantyClaimDto, clientHttpRequest) {
    return this.settingsService.find().pipe(
      switchMap(settings => {
        if (!settings) {
          return throwError(new NotImplementedException());
        }
        const warrantyClaim = new WarrantyClaim();
        Object.assign(warrantyClaim, warrantyClaimPayload);
        warrantyClaim._id = undefined;
        warrantyClaim.uuid = uuidv4();
        warrantyClaim.received_by = clientHttpRequest.token.fullName;
        warrantyClaim.claim_status = CLAIM_STATUS.IN_PROGRESS;
        warrantyClaim.createdOn = new DateTime(settings.timeZone).toJSDate();
        return of(warrantyClaim);
      }),
    );
  }

  createWarrantyNonWarrantyClaim(
    claimsPayload: WarrantyClaimDto,
    clientHttpRequest,
  ) {
    return this.warrantyClaimsPoliciesService
      .validateWarrantyCustomer(claimsPayload.customer_code)
      .pipe(
        switchMap(() => {
          return this.warrantyClaimsPoliciesService.validateWarrantySerialNo(
            claimsPayload,
          );
        }),
        switchMap((payload: WarrantyClaimDto) => {
          return this.assignFields(payload, clientHttpRequest);
        }),
        switchMap((warrantyClaimPayload: WarrantyClaim) => {
          return from(this.warrantyClaimService.create(warrantyClaimPayload));
        }),
        map(res => res.ops[0]),
        switchMap((res: WarrantyClaim) => {
          return this.addSerialNoHistory(
            res,
            [res.serial_no],
            clientHttpRequest.token,
          );
        }),
        switchMap(() => {
          return of(true);
        }),
        catchError(err => {
          return throwError(new BadRequestException(err));
        }),
      );
  }

  createNonSerialClaim(claimsPayload: WarrantyClaimDto, clientHttpRequest) {
    return this.warrantyClaimsPoliciesService
      .validateWarrantyCustomer(claimsPayload.customer_code)
      .pipe(
        switchMap(() => {
          return this.assignFields(claimsPayload, clientHttpRequest);
        }),
        switchMap((warrantyClaimPayload: WarrantyClaim) => {
          return from(this.warrantyClaimService.create(warrantyClaimPayload));
        }),
        map(res => res.ops[0]),
        switchMap((res: WarrantyClaim) => {
          return this.addSerialNoHistory(
            res,
            [res.serial_no],
            clientHttpRequest.token,
          );
        }),
        switchMap(() => {
          return of(true);
        }),
        catchError(err => {
          return throwError(new BadRequestException(err));
        }),
      );
  }

  createThirdPartyClaim(claimsPayload: WarrantyClaimDto, clientHttpRequest) {
    return this.addSerialRecord(claimsPayload, clientHttpRequest).pipe(
      switchMap(() => {
        return this.assignFields(claimsPayload, clientHttpRequest);
      }),
      switchMap(warrantyClaimPayload => {
        return from(this.warrantyClaimService.create(warrantyClaimPayload));
      }),
      map(res => res.ops[0]),
      switchMap((res: WarrantyClaim) => {
        return this.addSerialNoHistory(
          res,
          [res.serial_no],
          clientHttpRequest.token,
        );
      }),
      switchMap(() => {
        return of(true);
      }),
      catchError(err => {
        return throwError(new BadRequestException(err));
      }),
    );
  }

  addSerialRecord(warrantyPayload: WarrantyClaimDto, req) {
    if (!warrantyPayload.serial_no) {
      return of({});
    }
    return this.settingsService.find().pipe(
      switchMap(settings => {
        if (!settings) {
          return throwError(new NotImplementedException());
        }
        return this.serialNoBody(warrantyPayload, req, settings);
      }),
      switchMap(serialBody => {
        return from(this.serialNoService.create(serialBody));
      }),
      catchError(err => {
        return throwError(new BadRequestException(err));
      }),
    );
  }

  serialNoBody(payload: WarrantyClaimDto, req, settings) {
    const serialBody = {} as any;
    serialBody.date = DateTime.fromJSDate(new Date()).setZone(
      settings.timeZone,
    );
    serialBody.warranty = {};
    serialBody.serial_no = payload.serial_no;
    serialBody.item_code = payload.item_code;
    serialBody.purchase_date = payload.received_on;
    serialBody.purchase_time = payload.posting_time;
    serialBody.item_name = payload.item_name;
    serialBody.customer = payload.customer_code;
    serialBody.customer_name = payload.customer;
    serialBody.warranty.purchasedOn = serialBody.date;
    serialBody.warranty.purchaseWarrantyDate = serialBody.date;
    serialBody.warranty.salesWarrantyDate = payload.warranty_end_date
      ? payload.warranty_end_date
      : undefined;
    serialBody.warranty.soldOn = serialBody.date;
    serialBody.warehouse = req.token.warehouses[0];
    return of(serialBody);
  }

  async retrieveWarrantyClaim(uuid: string) {
    const provider = await this.warrantyClaimService.findOne({ uuid });
    if (!provider) throw new NotFoundException();
    return provider;
  }

  async getWarrantyClaimList(
    offset,
    limit,
    sort,
    filter_query?,
    territory?,
    req?,
  ) {
    return await this.warrantyClaimService.list(
      offset,
      limit,
      sort,
      filter_query,
      territory,
      req,
    );
  }

  async remove(uuid: string) {
    const found = await this.warrantyClaimService.findOne({ uuid });
    if (!found) {
      throw new NotFoundException();
    }
    this.apply(new WarrantyClaimRemovedEvent(found));
  }

  async update(updatePayload: UpdateWarrantyClaimDto) {
    const provider = await this.warrantyClaimService.findOne({
      uuid: updatePayload.uuid,
    });
    if (!provider) {
      throw new NotFoundException();
    }
    if (updatePayload.claim_type === WARRANTY_TYPE.NON_SERIAL) {
      updatePayload.serial_no = '';
    }
    const update = Object.assign(provider, updatePayload);

    update.modifiedOn = new Date();
    this.apply(new WarrantyClaimUpdatedEvent(update));
  }

  createBulkClaim(claimsPayload: WarrantyClaimDto, clientHttpRequest) {
    let bulk: WarrantyClaimDto;
    return this.AssignBulkStatusHistory(claimsPayload, clientHttpRequest).pipe(
      switchMap(warrantyBulkClaim => {
        return from(this.warrantyClaimService.create(warrantyBulkClaim));
      }),
      map(res => res.ops[0]),
      switchMap((bulkClaim: WarrantyClaimDto) => {
        bulk = bulkClaim;
        return this.createBulkSingularClaims(
          bulkClaim,
          bulkClaim,
          clientHttpRequest,
        );
      }),
      switchMap(() => {
        return from(
          this.warrantyClaimService.find({
            $or: [{ uuid: bulk.uuid }, { parent: bulk.uuid }],
          }),
        );
      }),
      switchMap((bulkClaims: WarrantyClaim[]) => {
        return this.AssignNamingSeries(bulkClaims);
      }),
      switchMap(() => {
        return of(true);
      }),
      catchError(() => {
        let count;
        return from(this.warrantyClaimService.find({ parent: bulk.uuid })).pipe(
          switchMap(subClaimCount => {
            count = subClaimCount.length;
            return from(subClaimCount).pipe(
              concatMap(Claim => {
                return this.cancelWarrantyClaim({
                  uuid: Claim.uuid,
                  serial_no: Claim.serial_no,
                  type: Claim.claim_type,
                });
              }),
              toArray(),
            );
          }),
          switchMap(() => {
            return from(
              this.warrantyClaimService.deleteMany({
                $or: [{ parent: bulk.uuid }, { uuid: bulk.uuid }],
              }),
            );
          }),
          switchMap(() => {
            return throwError(
              new BadRequestException(`Claim No ${count + 1} Is Invalid.`),
            );
          }),
        );
      }),
    );
  }

  AssignNamingSeries(bulkUuid: WarrantyClaim[]) {
    return from(bulkUuid).pipe(
      concatMap(draftClaim => {
        return from(
          this.warrantyClaimService.generateNamingSeries(draftClaim.set),
        ).pipe(
          switchMap((name: string) => {
            return forkJoin({
              warrantyService: from(
                this.warrantyClaimService.updateOne(
                  { uuid: draftClaim.uuid },
                  { $set: { claim_no: name } },
                ),
              ),
              serialHistoryEvent: from(
                this.serialNoHistoryService.updateMany(
                  { parent_document: draftClaim.uuid },
                  {
                    $set: {
                      document_no: name,
                    },
                  },
                ),
              ),
            });
          }),
        );
      }),
      toArray(),
    );
  }

  AssignBulkStatusHistory(claimsPayload: WarrantyClaimDto, clientHttpRequest) {
    return this.assignFields(claimsPayload, clientHttpRequest).pipe(
      switchMap(warrantyBulkClaim => {
        warrantyBulkClaim.set = CATEGORY.BULK;
        warrantyBulkClaim.status_history = [];
        warrantyBulkClaim.status_history.push({
          status: clientHttpRequest.token.fullName,
          posting_date: claimsPayload.received_on,
          time: claimsPayload.posting_time,
          verdict: VERDICT.RECEIVED_FROM_CUSTOMER,
          status_from: warrantyBulkClaim.receiving_branch,
          transfer_branch: '',
          description: '',
          delivery_status: '',
          created_by_email: clientHttpRequest.token.email,
          created_by: clientHttpRequest.token.fullName,
        });
        return of(warrantyBulkClaim);
      }),
    );
  }

  createBulkSingularClaims(bulkClaim, claimsPayload, clientHttpRequest) {
    return from(claimsPayload.bulk_products).pipe(
      concatMap((product: WarrantyBulkProducts) => {
        const singularClaimPayload = this.mapSingularClaim(bulkClaim, product);
        return this.addWarrantyClaim(singularClaimPayload, clientHttpRequest);
      }),
      toArray(),
      catchError(err => {
        return throwError(new BadRequestException(err));
      }),
    );
  }

  appendBulkClaim(claimsPayload: WarrantyClaimDto, clientHttpRequest) {
    let existingWarrantyClaim;
    return from(
      this.warrantyClaimService.findOne({ uuid: claimsPayload.uuid }),
    ).pipe(
      switchMap(warrantyBulkClaim => {
        existingWarrantyClaim = warrantyBulkClaim;
        const bulk_products = [
          ...warrantyBulkClaim.bulk_products,
          ...claimsPayload.bulk_products,
        ];
        return from(
          this.warrantyClaimService.updateOne(
            { uuid: claimsPayload.uuid },
            {
              $set: { bulk_products },
            },
          ),
        );
      }),
      switchMap(() => {
        return this.createBulkSingularClaims(
          { subclaim_state: 'Draft', ...existingWarrantyClaim },
          claimsPayload,
          clientHttpRequest,
        );
      }),
      switchMap(() => {
        return from(
          this.warrantyClaimService.updateMany(
            { parent: claimsPayload.uuid, subclaim_state: 'Draft' },
            { $unset: { subclaim_state: 1 } },
          ),
        );
      }),
      switchMap(() => {
        return from(
          this.warrantyClaimService.find({
            parent: existingWarrantyClaim.uuid,
            $expr: { $eq: ['$claim_no', '$uuid'] },
          }),
        );
      }),
      switchMap(draftSubClaim => {
        return this.AssignNamingSeries(draftSubClaim);
      }),
      catchError(() => {
        let count;
        return from(
          this.warrantyClaimService.find({
            parent: claimsPayload.uuid,
            subclaim_state: 'Draft',
          }),
        ).pipe(
          switchMap(subClaimCount => {
            count = subClaimCount.length;
            return from(subClaimCount).pipe(
              concatMap(Claim => {
                return this.cancelWarrantyClaim({
                  uuid: Claim.uuid,
                  serial_no: Claim.serial_no,
                  type: Claim.claim_type,
                });
              }),
              toArray(),
            );
          }),
          switchMap(() => {
            return from(
              this.warrantyClaimService.deleteMany({
                parent: claimsPayload.uuid,
                subclaim_state: 'Draft',
              }),
            );
          }),
          switchMap(() => {
            return throwError(
              new BadRequestException(
                `Claim No ${count + 1} is Invalid.Please Add Valid Claim`,
              ),
            );
          }),
        );
      }),
    );
  }

  mapSingularClaim(
    claimsPayload: WarrantyClaimDto,
    product: WarrantyBulkProducts,
  ) {
    Object.assign(claimsPayload, product);
    claimsPayload.parent = claimsPayload.uuid;
    claimsPayload.set = CATEGORY.PART;
    claimsPayload.bulk_products = undefined;
    return claimsPayload;
  }

  addBulkClaims(claimsPayload: File, clientHttpRequest) {
    return from(this.getJsonData(claimsPayload)).pipe(
      switchMap((data: BulkWarrantyClaimInterface) => {
        if (!data || !data.claims) {
          return throwError(new BadRequestException(INVALID_FILE));
        }
        return this.warrantyClaimsPoliciesService
          .validateBulkWarrantyClaim(data)
          .pipe(
            switchMap(() => {
              this.createBulkSerials(data.claims, clientHttpRequest);
              const mappedWarranty = this.mapWarrantyClaims(data.claims);
              this.apply(new BulkWarrantyClaimsCreatedEvent(mappedWarranty));
              return of({});
            }),
          );
      }),
    );
  }

  getJsonData(file) {
    return of(JSON.parse(file.buffer));
  }

  createBulkSerials(claims: BulkWarrantyClaim[], clientHttpRequest) {
    claims.forEach(claim => {
      const serialNo: SerialNoDto = {
        supplier: claim.supplier,
        serial_no: claim.serial_no,
        claim_no: claim.claim_no,
        claim_type: claim.claim_type,
        customer_third_party: claim.customer_third_party,
        item_code: claim.item_code,
        claimed_serial: claim.claimed_serial,
        invoice_no: claim.invoice_no,
        service_charge: claim.service_charge,
        claim_status: claim.claim_status,
        warranty_status: claim.warranty_status,
        receiving_branch: claim.receiving_branch,
        delivery_branch: claim.delivery_branch,
        received_by: claim.received_by,
        delivered_by: claim.delivered_by,
        received_date: new Date(),
        deliver_date: new Date(),
        brand: claim.brand,
      };
      return this.serialNoAggregateService
        .validateNewSerialNo(serialNo, clientHttpRequest)
        .pipe(
          switchMap(validSerialNo => {
            return from(this.serialNoService.create(validSerialNo));
          }),
        )
        .subscribe({
          next: () => {},
          error: () => {},
        });
    });
  }

  mapWarrantyClaims(claims: BulkWarrantyClaim[]) {
    const mappedClaims = [];
    claims.forEach(claim => {
      const warrantyClaim = new WarrantyClaim();
      warrantyClaim.serialNo = claim.serial_no;
      warrantyClaim.claim_no = claim.claim_no;
      warrantyClaim.claim_type = claim.claim_type;
      warrantyClaim.customer_third_party = claim.customer_third_party;
      warrantyClaim.item_code = claim.item_code;
      warrantyClaim.claimed_serial = claim.claimed_serial;
      warrantyClaim.invoice_no = claim.invoice_no;
      warrantyClaim.service_charge = claim.service_charge;
      warrantyClaim.claim_status = claim.claim_status;
      warrantyClaim.warranty_status = claim.warranty_status;
      warrantyClaim.receiving_branch = claim.receiving_branch;
      warrantyClaim.delivery_branch = claim.delivery_branch;
      warrantyClaim.received_by = claim.received_by;
      warrantyClaim.delivered_by = claim.delivered_by;
      warrantyClaim.received_date = new Date();
      warrantyClaim.deliver_date = new Date();
      warrantyClaim.uuid = uuidv4();
      mappedClaims.push(warrantyClaim);
    });
    return mappedClaims;
  }

  addStatusHistory(statusHistoryPayload: StatusHistoryDto, clientHttpRequest) {
    let warrantyState = {} as WarrantyClaim;
    const statusHistoryDetails = this.mapStatusHistory(
      statusHistoryPayload,
      clientHttpRequest,
    );
    let settings;
    return this.settingsService.find().pipe(
      switchMap(setting => {
        settings = setting;
        return from(
          this.warrantyClaimService.updateOne(
            { uuid: statusHistoryPayload.uuid },
            {
              $push: {
                status_history: statusHistoryDetails,
              },
            },
          ),
        );
      }),
      switchMap(() => {
        return this.setClaimStatus(statusHistoryPayload);
      }),
      switchMap(state => {
        return from(
          this.warrantyClaimService.updateOne(
            {
              uuid: statusHistoryPayload.uuid,
            },
            {
              $set: {
                claim_status: state,
              },
            },
          ),
        );
      }),
      switchMap(() => {
        if (!statusHistoryPayload.delivery_status) {
          return of({});
        }
        return from(
          this.warrantyClaimService.updateOne(
            { uuid: statusHistoryPayload.uuid },
            {
              $set: {
                delivery_date: statusHistoryPayload.posting_date,
                delivery_branch: statusHistoryPayload.delivery_branch,
                delivered_by: clientHttpRequest.token.fullName,
              },
            },
          ),
        );
      }),
      switchMap(() => {
        return this.warrantyClaimService.findOne({
          uuid: statusHistoryPayload.uuid,
        });
      }),
      switchMap(res => {
        warrantyState = res;
        statusHistoryPayload.doc_name = res.claim_no;
        if (res?.progress_state?.length) {
          return from(res.progress_state).pipe(
            concatMap(eachEntry => {
              return this.addSerialNoStatusHistory(
                statusHistoryPayload,
                [eachEntry.items[0].excel_serials],
                clientHttpRequest.token,
              );
            }),
            toArray(),
          );
        }
        return this.addSerialNoStatusHistory(
          statusHistoryPayload,
          [res.serial_no],
          clientHttpRequest.token,
        );
      }),
      switchMap(() => {
        if (
          warrantyState.claim_status === CLAIM_STATUS.DELIVERED ||
          warrantyState.claim_status === CLAIM_STATUS.UNSOLVED
        ) {
          if (warrantyState.progress_state) {
            return from(warrantyState.progress_state).pipe(
              concatMap(eachEntry => {
                if (
                  eachEntry.stock_entry_type === STOCK_ENTRY_STATUS.returned
                ) {
                  return from(
                    this.serialNoService.updateOne(
                      { serial_no: eachEntry.items.find(x => x).excel_serials },
                      {
                        $unset: { claim_no: 1, 'warranty.soldOn': 1 },
                      },
                    ),
                  );
                } else {
                  return from(
                    this.serialNoService.updateOne(
                      { serial_no: eachEntry.items.find(x => x).excel_serials },
                      [
                        {
                          $set: {
                            'warranty.soldOn': new DateTime(
                              settings.timeZone,
                            ).toJSDate(),
                          },
                        },
                        {
                          $unset: ['claim_no'],
                        },
                      ],
                    ),
                  );
                }
              }),
              toArray(),
            );
          }
          return from(
            this.serialNoService.updateOne(
              { serial_no: warrantyState.serial_no },
              {
                $set: {
                  'warranty.soldOn': new DateTime(settings.timeZone).toJSDate(),
                },
                $unset: { claim_no: 1 },
              },
            ),
          );
        }
        return of();
      }),
    );
  }

  mapStatusHistory(statusHistoryPayload: StatusHistoryDto, clientHttpRequest) {
    const statusHistory: any = {};
    Object.assign(statusHistory, statusHistoryPayload);
    statusHistory.status = clientHttpRequest.token.fullName;
    statusHistory.created = clientHttpRequest.token.fullName;
    statusHistory.created_by_email = clientHttpRequest.token.email;
    return statusHistory;
  }

  removeStatusHistory(uuid) {
    let setting;
    return this.settingsService.find().pipe(
      switchMap(res => {
        setting = res;
        return from(
          this.warrantyClaimService.findOne(uuid, {
            status_history: { $slice: -1 },
          }),
        );
      }),
      switchMap(res => {
        if (res.status_history.length > 1) {
          const statusHistory = {} as StatusHistoryDto;
          Object.assign(
            statusHistory,
            res.status_history[res.status_history.length - 2],
          );
          statusHistory.doc_name = res.claim_no;
          if (statusHistory.verdict === VERDICT.RECEIVED_FROM_CUSTOMER) {
            statusHistory.transfer_branch = statusHistory.status_from;
            statusHistory.status_from = res.customer;
          }
          const verdict_key = Object.keys(VERDICT).find(
            key => VERDICT[key] === statusHistory.verdict,
          );
          const eventType = EventType[verdict_key];
          const serialNoHistory: SerialNoHistoryInterface = {};
          serialNoHistory.created_by = statusHistory.created_by;
          serialNoHistory.created_on = statusHistory.posting_date;
          serialNoHistory.document_no = statusHistory.doc_name;
          serialNoHistory.document_type = WARRANTY_CLAIM_DOCTYPE;
          serialNoHistory.eventDate = DateTime.fromISO(
            statusHistory.posting_date,
          ).setZone(setting.timeZone);
          serialNoHistory.eventType = eventType;
          serialNoHistory.parent_document = res.uuid;
          serialNoHistory.transaction_from = statusHistory.status_from;
          serialNoHistory.transaction_to = !statusHistory.transfer_branch
            ? statusHistory.status_from
            : statusHistory.transfer_branch;
          return forkJoin({
            updateResult: from(
              this.serialNoHistoryService.updateOne(
                {
                  serial_no: res.serial_no,
                  parent_document: res.uuid,
                  document_type: WARRANTY_CLAIM_DOCTYPE,
                },
                {
                  $set: serialNoHistory,
                },
              ),
            ),
            statusPayload: of(
              res.status_history[res.status_history.length - 2],
            ),
            serialInfo: of(
              this.serialNoService.updateOne(
                { serial_no: res.serial_no },
                {
                  $set: {
                    claim_no: res.claim_no,
                  },
                },
              ),
            ),
          });
        }
        return throwError(
          new BadRequestException('cannot cancel single status'),
        );
      }),
      switchMap(state => {
        return this.setClaimStatus(state.statusPayload);
      }),
      switchMap(state => {
        return from(
          this.warrantyClaimService.updateOne(uuid, {
            $set: {
              delivery_branch: '',
              delivery_date: '',
              claim_status: state,
            },
            $pop: {
              status_history: 1,
            },
          }),
        );
      }),
      catchError(() => {
        return throwError(new BadRequestException('Not a valid object'));
      }),
    );
  }

  setClaimStatus(statusHistoryPayload) {
    let status = '';
    switch (statusHistoryPayload.verdict) {
      case VERDICT.RECEIVED_FROM_CUSTOMER:
        status = CLAIM_STATUS.IN_PROGRESS;
        break;
      case VERDICT.RECEIVED_FROM_BRANCH:
        status = CLAIM_STATUS.IN_PROGRESS;
        break;
      case VERDICT.WORK_IN_PROGRESS:
        status = CLAIM_STATUS.IN_PROGRESS;
        break;
      case VERDICT.SENT_TO_ENG_DEPT:
        status = CLAIM_STATUS.IN_PROGRESS;
        break;
      case VERDICT.SENT_TO_REPAIR_DEPT:
        status = CLAIM_STATUS.IN_PROGRESS;
        break;
      case VERDICT.TRANSFERRED:
        status = CLAIM_STATUS.IN_PROGRESS;
        break;
      case VERDICT.SOLVED:
        status = CLAIM_STATUS.TO_DELIVER;
        break;
      case VERDICT.UNSOLVED:
        status = CLAIM_STATUS.UNSOLVED;
        break;
      case VERDICT.TO_REPLACE:
        status = CLAIM_STATUS.TO_DELIVER;
        break;
      case VERDICT.DELIVER_TO_CUSTOMER:
        this.checkDeliveryStatus(
          statusHistoryPayload.delivery_status,
        ).subscribe({
          next: claim_status => {
            status = claim_status;
          },
        });
        break;
      default:
        return throwError(new BadRequestException(`verdict invalid`));
    }
    return of(status);
  }

  checkDeliveryStatus(delivery_status: string) {
    switch (delivery_status) {
      case DELIVERY_STATUS.REPAIRED:
        delivery_status = CLAIM_STATUS.DELIVERED;
        break;
      case DELIVERY_STATUS.REPLACED:
        delivery_status = CLAIM_STATUS.DELIVERED;
        break;
      case DELIVERY_STATUS.UPGRADED:
        delivery_status = CLAIM_STATUS.DELIVERED;
        break;
      case DELIVERY_STATUS.REJECTED:
        delivery_status = CLAIM_STATUS.UNSOLVED;
        break;
      default:
        return throwError(new BadRequestException(`Invalid Delivery Status`));
    }
    return of(delivery_status);
  }

  addSerialNoHistory(warrantyClaim: WarrantyClaim, serialArray, token) {
    return this.settingsService.find().pipe(
      switchMap(settings => {
        const serialHistory: SerialNoHistoryInterface = {};
        serialHistory.created_by = token.fullName;
        serialHistory.created_on = new DateTime(settings.timeZone).toJSDate();
        serialHistory.document_no = warrantyClaim.claim_no;
        // serialHistory.readable_document_no = warrantyClaim.claim_no;
        serialHistory.document_type = WARRANTY_CLAIM_DOCTYPE;
        serialHistory.eventDate = new DateTime(settings.timeZone);
        serialHistory.eventType = EventType.RECEIVED_FROM_CUSTOMER;
        serialHistory.parent_document = warrantyClaim.uuid;
        serialHistory.transaction_from = warrantyClaim.customer;
        serialHistory.transaction_to = warrantyClaim.receiving_branch;
        return this.serialNoHistoryService.addSerialHistory(
          serialArray,
          serialHistory,
        );
      }),
      switchMap(() => {
        return this.serialNoService.updateOne(
          {
            serial_no: warrantyClaim.serial_no,
          },
          {
            $set: {
              claim_no: warrantyClaim.claim_no,
            },
          },
        );
      }),
    );
  }

  addSerialNoStatusHistory(
    statusHistoryPayload: StatusHistoryDto,
    serialArray,
    token,
  ) {
    const verdict_key = Object.keys(VERDICT).find(
      key => VERDICT[key] === statusHistoryPayload.verdict,
    );
    const eventType = EventType[verdict_key];
    return this.settingsService.find().pipe(
      switchMap(settings => {
        const serialHistory: SerialNoHistoryInterface = {};
        serialHistory.created_by = token.fullName;
        serialHistory.created_on = new DateTime(settings.timeZone).toJSDate();
        serialHistory.document_no = statusHistoryPayload.doc_name;
        serialHistory.naming_series = statusHistoryPayload.doc_name;
        serialHistory.document_type = WARRANTY_CLAIM_DOCTYPE;
        serialHistory.eventDate = new DateTime(settings.timeZone);
        serialHistory.eventType = eventType
          ? eventType
          : statusHistoryPayload.verdict;
        serialHistory.parent_document = statusHistoryPayload.uuid;
        serialHistory.transaction_from = statusHistoryPayload.status_from;
        serialHistory.transaction_to = !statusHistoryPayload.transfer_branch
          ? statusHistoryPayload.status_from
          : statusHistoryPayload.transfer_branch;
        if (statusHistoryPayload.verdict === VERDICT.RECEIVED_FROM_CUSTOMER) {
          return this.serialNoHistoryService.addSerialHistory(
            serialArray,
            serialHistory,
          );
        }
        return this.serialNoHistoryService.updateOne(
          {
            serial_no: serialArray[0],
            document_type: WARRANTY_CLAIM_DOCTYPE,
            document_no: statusHistoryPayload.doc_name,
          },
          {
            $set: serialHistory,
          },
        );
      }),
    );
  }

  cancelWarrantyClaim(cancelPayload: {
    uuid: string;
    serial_no: string;
    type?: string;
  }) {
    return this.warrantyClaimsPoliciesService
      .validateCancelClaim(cancelPayload.uuid)
      .pipe(
        switchMap(() => {
          return this.warrantyClaimsPoliciesService.validateServiceInvoice(
            cancelPayload.uuid,
          );
        }),
        switchMap(() => {
          return from(
            this.warrantyClaimService.updateOne(
              { uuid: cancelPayload.uuid },
              {
                $set: {
                  claim_status: 'Cancelled',
                },
              },
            ),
          );
        }),
        switchMap(() => {
          return forkJoin({
            claim: this.warrantyClaimService.findOne({
              uuid: cancelPayload.uuid,
            }),
            serialHistory: this.serialNoHistoryService.findOne({
              serial_no: cancelPayload.serial_no,
            }),
          });
        }),
        switchMap(claim => {
          if (cancelPayload.serial_no && claim.serialHistory) {
            if (claim.claim.claim_type === WARRANTY_TYPE.THIRD_PARTY) {
              cancelPayload.type = claim.claim.claim_type;
              return from(
                this.serialNoService.deleteOne({
                  serial_no: cancelPayload.serial_no,
                }),
              );
            }
            return from(
              this.serialNoService.updateOne(
                { serial_no: cancelPayload.serial_no },
                {
                  $unset: { claim_no: 1 },
                },
              ),
            );
          }
          return of({});
        }),
        switchMap(() => {
          if (cancelPayload.type === WARRANTY_TYPE.THIRD_PARTY) {
            return from(
              this.serialNoHistoryService.deleteMany({
                serial_no: cancelPayload.serial_no,
                parent_document: cancelPayload.uuid,
              }),
            );
          }
          return from(
            this.serialNoHistoryService.deleteOne({
              parent_document: cancelPayload.uuid,
            }),
          );
        }),
        catchError(err => {
          return throwError(new BadRequestException(err));
        }),
      );
  }

  syncWarrantyClaimDocument(req, warrantyPrintBody: WarrantyPrintDetails) {
    let url: string = '';
    return this.settingsService.find().pipe(
      switchMap(setting => {
        if (!setting.authServerURL) {
          return throwError(new NotImplementedException());
        }
        url = `${setting.authServerURL}${POST_WARRANTY_PRINT_ENDPOINT}`;
        return this.http.get(`${url}/${warrantyPrintBody.uuid}`, {
          headers: {
            authorization: req.headers.authorization,
            Accept: APPLICATION_JSON_CONTENT_TYPE,
          },
        });
      }),
      map(res => res.data),
      switchMap(() => {
        return this.http.put(
          `${url}/${warrantyPrintBody.uuid}`,
          warrantyPrintBody,
          {
            headers: {
              authorization: req.headers.authorization,
              Accept: APPLICATION_JSON_CONTENT_TYPE,
            },
          },
        );
      }),
      map(res => res.data),
      catchError(err => {
        if (err.response.status === 404) {
          return this.http.post(url, warrantyPrintBody, {
            headers: {
              authorization: req.headers.authorization,
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
