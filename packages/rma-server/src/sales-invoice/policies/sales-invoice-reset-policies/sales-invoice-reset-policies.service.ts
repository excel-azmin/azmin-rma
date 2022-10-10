import { BadRequestException, Injectable } from '@nestjs/common';
import { SalesInvoice } from '../../entity/sales-invoice/sales-invoice.entity';
import {
  AGENDA_JOB_STATUS,
  COMPLETED_STATUS,
  CREATE_DELIVERY_NOTE_JOB,
  TO_DELIVER_STATUS,
} from '../../../constants/app-strings';
import { forkJoin, from, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  OverlappingEventInterface,
  SerialNoHistoryPoliciesService,
} from '../../../serial-no/policies/serial-no-history-policies/serial-no-history-policies.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { AgendaJobService } from '../../../sync/entities/agenda-job/agenda-job.service';

@Injectable()
export class SalesInvoiceResetPoliciesService {
  constructor(
    private readonly serialNoService: SerialNoService,
    private readonly serialHistoryPolicyService: SerialNoHistoryPoliciesService,
    private readonly agendaJob: AgendaJobService,
  ) {}

  validateSalesInvoiceReset(salesInvoice: SalesInvoice) {
    if (![TO_DELIVER_STATUS, COMPLETED_STATUS].includes(salesInvoice.status)) {
      return throwError(
        new BadRequestException(
          `${salesInvoice.status} Sales Invoice cannot be canceled`,
        ),
      );
    }

    const returned_serials = [];
    salesInvoice.returned_items.forEach(item =>
      item?.serial_no
        ? returned_serials.push(...item?.serial_no?.split('\n'))
        : null,
    );
    return forkJoin({
      validateSerialState: this.validateSerialState(salesInvoice),
      validateReturnSerialState: this.validateReturnSerialState(
        returned_serials,
      ),
      validateSerials: this.validateLinkedSerials(
        salesInvoice,
        returned_serials,
      ),
      validateQueueState: this.validateQueueState(salesInvoice),
    }).pipe(switchMap(isValid => of(salesInvoice)));
  }

  validateQueueState(salesInvoice) {
    return from(
      this.agendaJob.count({
        'data.parent': salesInvoice.name,
        'data.type': CREATE_DELIVERY_NOTE_JOB,
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
              `Found ${response}, jobs in queue for sales invoice: ${salesInvoice.name}`,
            ),
          );
        }
        return of(true);
      }),
    );
  }

  validateSerialState(invoice: SalesInvoice) {
    return from(
      this.serialNoService.count({
        sales_invoice_name: invoice.name,
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

  validateLinkedSerials(invoice: SalesInvoice, returned_serials: string[]) {
    return this.serialNoService
      .asyncAggregate([
        {
          $match: {
            sales_invoice_name: invoice.name,
          },
        },
        {
          $group: {
            _id: '$sales_invoice_name',
            serials: {
              $push: '$serial_no',
            },
          },
        },
      ])
      .pipe(
        switchMap((data: { _id: string; serials: string[] }[]) => {
          if (!data || !data.length) {
            return of([]);
          }
          return this.serialHistoryPolicyService.validateLatestEventWithParent(
            invoice.name,
            [...returned_serials, ...data[0].serials],
          );
        }),
        switchMap((response: OverlappingEventInterface[]) => {
          if (response?.length === 0) {
            return of(true);
          }
          let message = `Found ${response.length} Events, please cancel Following events for serials`;
          response.forEach(value =>
            value
              ? (message += `${value._id} : ${value.serials
                  .splice(0, 50)
                  .join(', ')}`)
              : null,
          );
          return throwError(new BadRequestException(message));
        }),
      );
  }

  validateReturnSerialState(serial_no: string[]) {
    return from(
      this.serialNoService.count({
        serial_no: { $in: serial_no },
        queue_state: { $gt: {} },
      }),
    ).pipe(
      switchMap(count => {
        if (count) {
          return throwError(
            new BadRequestException(
              `
              Found ${count} returned serials to be already in queue, please reset this queue to proceed. 
              ${serial_no.splice(0, 50).join(', ')}
              `,
            ),
          );
        }
        return of(true);
      }),
    );
  }
}
