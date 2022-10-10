import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import * as Agenda from 'agenda';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';
import {
  FRAPPE_QUEUE_JOB,
  AGENDA_JOB_STATUS,
  AGENDA_MAX_RETRIES,
} from '../../../constants/app-strings';
import { DateTime } from 'luxon';
import { PurchaseReceiptSyncService } from '../../../purchase-receipt/schedular/purchase-receipt-sync/purchase-receipt-sync.service';
import { DeliveryNoteJobService } from '../../../delivery-note/schedular/delivery-note-job/delivery-note-job.service';
import { AgendaJob } from '../../entities/agenda-job/agenda-job.entity';
import { StockEntrySyncService } from '../../../stock-entry/schedular/stock-entry-sync/stock-entry-sync.service';
import { AGENDA_JOBS_CONCURRENCY } from '../../../config/config.service';
import { AGENDA_JOBS_CONCURRENCY_MESSAGE } from '../../../constants/messages';

@Injectable()
export class FrappeJobService implements OnModuleInit {
  constructor(
    @Inject(AGENDA_TOKEN)
    private readonly agenda: Agenda,
    public readonly CREATE_PURCHASE_RECEIPT_JOB: PurchaseReceiptSyncService,
    public readonly CREATE_DELIVERY_NOTE_JOB: DeliveryNoteJobService,
    public readonly CREATE_STOCK_ENTRY_JOB: StockEntrySyncService,
    public readonly ACCEPT_STOCK_ENTRY_JOB: StockEntrySyncService,
    public readonly REJECT_STOCK_ENTRY_JOB: StockEntrySyncService,
  ) {}

  async onModuleInit() {
    Logger.log(
      AGENDA_JOBS_CONCURRENCY_MESSAGE + process.env[AGENDA_JOBS_CONCURRENCY] ||
        '1',
      AGENDA_JOBS_CONCURRENCY,
    );
    this.agenda.define(
      FRAPPE_QUEUE_JOB,
      { concurrency: Number(process.env[AGENDA_JOBS_CONCURRENCY]) || 1 },
      async (job: any, done) => {
        // Please note done callback will work only when concurrency is provided.
        this[job.attrs.data.type]
          .execute(job)
          .toPromise()
          .then(success => {
            if (EXPORT_BASED_DATA_IMPORT_JOBS.includes(job.attrs.data.type)) {
              job.attrs.data.status = AGENDA_JOB_STATUS.exported;
            } else {
              job.attrs.data.status = AGENDA_JOB_STATUS.success;
            }
            return done();
          })
          .catch(err => {
            job.attrs.data.status = AGENDA_JOB_STATUS.retrying;
            return done(this.getPureError(err));
          });
      },
    );
    this.agenda.on(`fail:${FRAPPE_QUEUE_JOB}`, (error, job) =>
      this.onJobFailure(error, job),
    );
  }

  resetState(job: AgendaJob) {
    return this[job.data.type].resetState(job);
  }

  async onJobFailure(error: any, job: Agenda.Job<any>) {
    const retryCount = job.attrs.failCount - 1;
    if (retryCount < AGENDA_MAX_RETRIES) {
      job.attrs.data.status = AGENDA_JOB_STATUS.retrying;
      job.attrs.nextRunAt = this.getExponentialBackOff(
        retryCount,
        job.attrs.data.settings.timeZone,
      );
    } else {
      job.attrs.data.status = AGENDA_JOB_STATUS.fail;
    }
    await job.save();
  }

  getExponentialBackOff(retryCount: number, timeZone): Date {
    const waitInSeconds =
      Math.pow(retryCount, 4) + 15 + Math.random() * 30 * (retryCount + 1);
    return new DateTime(timeZone).plus({ seconds: waitInSeconds }).toJSDate();
  }

  replaceErrors(keys, value) {
    if (value instanceof Error) {
      const error = {};

      Object.getOwnPropertyNames(value).forEach(function (key) {
        error[key] = value[key];
      });

      return error;
    }

    return value;
  }

  getPureError(error) {
    if (error && error.response) {
      error = error.response.data ? error.response.data : error.response;
    }
    try {
      return JSON.parse(JSON.stringify(error, this.replaceErrors));
    } catch {
      return error.data ? error.data : error;
    }
  }
}

export const EXPORT_BASED_DATA_IMPORT_JOBS = [
  'CREATE_DELIVERY_NOTE_JOB',
  'CREATE_PURCHASE_RECEIPT_JOB',
];
