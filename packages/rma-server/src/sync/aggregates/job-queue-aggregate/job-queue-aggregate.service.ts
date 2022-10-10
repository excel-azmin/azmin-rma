import {
  Injectable,
  Inject,
  BadRequestException,
  HttpService,
} from '@nestjs/common';
import * as Agenda from 'agenda';
import { AgendaJobService } from '../../entities/agenda-job/agenda-job.service';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';
import { ObjectId } from 'mongodb';
import {
  AGENDA_JOB_STATUS,
  SYNC_DELIVERY_NOTE_JOB,
  SYNC_PURCHASE_RECEIPT_JOB,
  FRAPPE_JOB_SELECT_FIELDS,
  BEARER_HEADER_VALUE_PREFIX,
  DELIVERY_NOTE_DOCTYPE_NAMES,
  ACCEPT_STOCK_ENTRY_JOB,
  REJECT_STOCK_ENTRY_JOB,
  CREATE_STOCK_ENTRY_JOB,
} from '../../../constants/app-strings';
import { from, throwError, of } from 'rxjs';
import { switchMap, map, catchError, retry, delay } from 'rxjs/operators';
import { FrappeJobService } from '../../schedular/frappe-jobs-queue/frappe-jobs-queue.service';
import { PurchaseReceiptSyncService } from '../../../purchase-receipt/schedular/purchase-receipt-sync/purchase-receipt-sync.service';
import { ExcelDataImportWebhookDto } from '../../../constants/listing-dto/job-queue-list-query.dto';
import {
  AUTHORIZATION,
  VALIDATE_AUTH_STRING,
} from '../../../constants/app-strings';
import { DirectService } from '../../../direct/aggregates/direct/direct.service';
import { PURCHASE_RECEIPT_DOCTYPE_NAMES } from '../../../constants/app-strings';
import { DeliveryNoteJobService } from '../../../delivery-note/schedular/delivery-note-job/delivery-note-job.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { LEGACY_DATA_IMPORT_API_ENDPOINT } from '../../../constants/routes';
import { AgendaJob } from '../../entities/agenda-job/agenda-job.entity';
import { FRAPPE_QUEUE_JOB } from '../../../constants/app-strings';

@Injectable()
export class JobQueueAggregateService {
  resetJobs: string[] = [
    'CREATE_PURCHASE_RECEIPT_JOB',
    'CREATE_DELIVERY_NOTE_JOB',
    CREATE_STOCK_ENTRY_JOB,
    ACCEPT_STOCK_ENTRY_JOB,
    REJECT_STOCK_ENTRY_JOB,
  ];
  constructor(
    @Inject(AGENDA_TOKEN)
    private readonly agenda: Agenda,
    private readonly settingService: SettingsService,
    private readonly jobService: AgendaJobService,
    private readonly frappeQueueService: FrappeJobService,
    private readonly tokenService: DirectService,
    private readonly http: HttpService,
    private readonly CREATE_PURCHASE_RECEIPT_JOB: PurchaseReceiptSyncService,
    private readonly CREATE_DELIVERY_NOTE_JOB: DeliveryNoteJobService,
  ) {}

  async list(skip, take, sort, filter, token) {
    return await this.jobService.list(
      Number(skip),
      Number(take),
      sort,
      token,
      filter,
    );
  }

  resetJob(jobId) {
    return from(this.jobService.findOne({ _id: new ObjectId(jobId) })).pipe(
      switchMap(job => {
        return this.validateJobReset(job).pipe(switchMap(() => of(job)));
      }),
      switchMap(job => {
        return this.frappeQueueService.resetState(job).pipe(
          switchMap(success => {
            const $or: any[] = [{ _id: new ObjectId(jobId) }];
            if (job.data && job.data.uuid) {
              $or.push({ 'data.uuid': job.data.uuid });
            }
            this.jobService
              .updateOne(
                { $or },
                {
                  $set: { 'data.status': AGENDA_JOB_STATUS.reset },
                  $unset: {
                    nextRunAt: undefined,
                    lockedAt: undefined,
                    lastRunAt: undefined,
                  },
                },
              )
              .catch(err => {})
              .then(done => {});
            return of({});
          }),
        );
      }),
    );
  }

  validateJobReset(job: AgendaJob) {
    return this.validateJobState(job).pipe(
      switchMap(() => {
        return from(
          this.jobService.findOne({
            name: FRAPPE_QUEUE_JOB,
            'data.parent': job.data.parent,
            _id: { $gt: job._id },
            'data.status': {
              $nin: [AGENDA_JOB_STATUS.reset, AGENDA_JOB_STATUS.success],
            },
          }),
        ).pipe(
          switchMap(job => {
            if (job) {
              return throwError(
                new BadRequestException(
                  'Please cancel the job that is created before the current job.',
                ),
              );
            }
            return of(true);
          }),
        );
      }),
    );
  }

  validateJobState(job: AgendaJob) {
    if (!job) {
      return throwError(new BadRequestException('Job not found.'));
    }
    if (
      job.data.status === AGENDA_JOB_STATUS.reset ||
      job.data.status === AGENDA_JOB_STATUS.success
    ) {
      return throwError(
        new BadRequestException(
          `Jobs with status ${job.data.status}, cannot be reseted.`,
        ),
      );
    }
    // remove after new feature added
    if (!this.resetJobs.includes(job.data.type)) {
      return throwError(
        new BadRequestException(
          `Reset State currently available for
          ${this.resetJobs
            .filter(elem => elem.replace('_', ' ').toLocaleLowerCase())
            .join(', ')}, coming soon for
          ${job.data.type.replace('_', ' ').toLocaleLowerCase()}`,
        ),
      );
    }
    return of(true);
  }

  async retryJob(jobId) {
    return await this.jobService.updateOne(
      { _id: new ObjectId(jobId) },
      {
        $set: {
          nextRunAt: new Date(),
          'data.status': AGENDA_JOB_STATUS.in_queue,
          failCount: 0,
        },
      },
    );
  }

  syncJob(jobId, clientHttpReq) {
    return from(
      this.jobService.findOne({
        where: { _id: new ObjectId(jobId) },
        select: ['_id', 'data.dataImport'],
      }),
    ).pipe(
      switchMap(job => {
        if (
          !job ||
          !job.data ||
          !job.data.dataImport ||
          !job.data.dataImport.dataImportName
        ) {
          return throwError(
            new BadRequestException(
              'Error occurred in fetching dataImport please try again after some time.',
            ),
          );
        }
        return this.settingService.find().pipe(
          switchMap(settings => {
            const headers = {};
            headers[AUTHORIZATION] =
              BEARER_HEADER_VALUE_PREFIX + clientHttpReq.token.accessToken;
            return this.http.get(
              settings.authServerURL +
                `${LEGACY_DATA_IMPORT_API_ENDPOINT}/${job.data.dataImport.dataImportName}`,
              { headers },
            );
          }),
          map(data => data.data.data),
          switchMap((dataImport: any) => {
            return this.jobUpdated(dataImport, true);
          }),
        );
      }),
    );
  }

  async create(jobId: string) {
    const _id = new ObjectId(jobId);
    const job = await this.jobService.findOne({ _id });
    const newJob = this.agenda.create(job.name, job.data);
    await newJob.save();
    return newJob;
  }

  async getOneDataImportJob(uuid: string) {
    const job = await this.jobService.findOne({
      where: {
        'data.type': {
          $in: [SYNC_DELIVERY_NOTE_JOB, SYNC_PURCHASE_RECEIPT_JOB],
        },
        'data.uuid': uuid,
      },
      select: FRAPPE_JOB_SELECT_FIELDS,
    });

    if (!job) {
      return throwError(new BadRequestException('Export job dose not exists.'));
    }

    return job;
  }

  jobUpdated(payload: ExcelDataImportWebhookDto, messages?) {
    if (
      !payload ||
      !payload.import_status ||
      payload.import_status === 'In Progress'
    ) {
      return of(
        messages
          ? { message: 'Job still in queue, try again after some time.' }
          : true,
      );
    }
    if (payload.import_status === AGENDA_JOB_STATUS.success) {
      const parsed_response = JSON.parse(payload.log_details);
      const link = parsed_response.messages[0].link.split('/');
      const doctype = link[link.length - 2];
      const doctype_name = link[link.length - 1];
      this.syncUpdatedJob(payload, doctype_name, doctype);
      return of(
        messages
          ? {
              message:
                'Job succeeded, serials and related data will be synced.',
            }
          : true,
      );
    }

    return from(
      this.jobService.updateOne(
        { 'data.dataImport.dataImportName': payload.name },
        {
          $set: {
            'data.status': AGENDA_JOB_STATUS.fail,
            failReason: payload,
          },
        },
      ),
    ).pipe(
      switchMap(success => {
        return of(
          messages
            ? {
                message:
                  'Job found to be In Progress or Failed, please wait or consider requeue or reset in case of deadlock.',
              }
            : true,
        );
      }),
    );
  }

  validatedUpdatedJob(payload: ExcelDataImportWebhookDto) {
    return of({}).pipe(
      switchMap(obj => {
        return from(
          this.jobService.findOne({
            where: { 'data.dataImport.dataImportName': payload.name },
            select: ['_id'],
          }),
        );
      }),
      delay(1337),
      switchMap(job => {
        return job ? of(true) : throwError(new BadRequestException());
      }),
      retry(3),
      catchError(err => of(false)),
    );
  }

  syncUpdatedJob(
    payload: ExcelDataImportWebhookDto,
    doctype_name: string,
    doctype: string,
  ) {
    return this.validatedUpdatedJob(payload)
      .pipe(
        switchMap(isValid => {
          isValid ? this.syncJobData(payload, doctype_name, doctype) : null;
          return of(true);
        }),
      )
      .subscribe({
        next: success => {},
        error: err => {},
      });
  }

  syncJobData(
    payload: ExcelDataImportWebhookDto,
    doctype_name: string,
    doctype: string,
  ) {
    from(
      this.jobService.findOne({
        'data.dataImport.dataImportName': payload.name,
      }),
    )
      .pipe(
        switchMap(job => {
          if (!job) {
            let webhook_data = '';
            try {
              webhook_data = JSON.stringify(payload);
            } catch {
              webhook_data = JSON.stringify({
                name: payload.name,
              });
            }
            return throwError('Parent job dose not exists. : ' + webhook_data);
          }
          return of({}).pipe(
            switchMap(object => {
              const headers = {};
              headers[AUTHORIZATION] =
                BEARER_HEADER_VALUE_PREFIX + job.data.token.accessToken;
              return this.http
                .get(
                  job.data.settings.authServerURL +
                    `/api/resource/${doctype}/${doctype_name}`,
                  { headers },
                )
                .pipe(
                  map(data => data.data.data),
                  switchMap((doc: { items: any[] }) => {
                    if (PURCHASE_RECEIPT_DOCTYPE_NAMES.includes(doctype)) {
                      return this.CREATE_PURCHASE_RECEIPT_JOB.linkPurchaseWarranty(
                        job.data.payload,
                        {
                          name: doctype_name,
                          items: doc.items,
                        },
                        job.data.token,
                        job.data.settings,
                        job.data.parent,
                      );
                    }
                    if (DELIVERY_NOTE_DOCTYPE_NAMES.includes(doctype)) {
                      return this.CREATE_DELIVERY_NOTE_JOB.linkDeliveryNote(
                        job.data.payload,
                        {
                          name: doctype_name,
                          items: doc.items,
                        },
                        job.data.token,
                        job.data.settings,
                        job.data.parent,
                      );
                    }
                    return throwError(
                      `Doctype ${doctype_name} with doc ${doctype} not found.`,
                    );
                  }),
                );
            }),
            catchError(err => {
              if (
                (err && err.response && err.response.status === 403) ||
                (err &&
                  err.response &&
                  err.response.data &&
                  err.response.data.exc &&
                  err.response.data.exc.includes(VALIDATE_AUTH_STRING))
              ) {
                return this.tokenService
                  .getUserAccessToken(job.data.token.email)
                  .pipe(
                    switchMap(token => {
                      job.data.token.accessToken = token.accessToken;
                      return throwError(err);
                    }),
                  );
              }
              return throwError(err);
            }),
            retry(3),
          );
        }),
      )
      .subscribe({
        next: success => {
          this.jobService
            .deleteOne({ 'data.dataImport.dataImportName': payload.name })
            .then(done => {})
            .catch(err => {});
        },
        error: error => {
          this.jobService
            .updateOne(
              { 'data.dataImport.dataImportName': payload.name },
              {
                $set: {
                  'data.status': AGENDA_JOB_STATUS.fail,
                  failReason: error,
                },
              },
            )
            .then(success => {})
            .catch(err => {});
        },
      });
  }

  deleteEmptyJobs(file, req) {
    return of(JSON.parse(file.buffer)).pipe(
      switchMap((data: AgendaJob[]) => {
        const id = [];
        data.forEach(job => id.push(new ObjectId(job._id)));
        return from(
          this.jobService.deleteMany({
            _id: { $in: id },
            'data.status': {
              $in: [AGENDA_JOB_STATUS.reset, AGENDA_JOB_STATUS.success],
            },
          }),
        );
      }),
      switchMap(() => of(true)),
    );
  }
}
