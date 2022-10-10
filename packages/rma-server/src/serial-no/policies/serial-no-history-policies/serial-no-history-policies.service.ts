import { BadRequestException, Injectable } from '@nestjs/common';
import { from, Observable, of, throwError } from 'rxjs';
import { concatMap, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { CreateSalesReturnDto } from '../../../sales-invoice/entity/sales-invoice/sales-return-dto';
import { SerialNoHistory } from '../../../serial-no/entity/serial-no-history/serial-no-history.entity';
import { SerialNoHistoryService } from '../../entity/serial-no-history/serial-no-history.service';

@Injectable()
export class SerialNoHistoryPoliciesService {
  constructor(
    private readonly serialNoHistoryService: SerialNoHistoryService,
  ) {}

  validateLatestEventWithParent(
    parent_document: string,
    serial_no: string[],
  ): Observable<OverlappingEventInterface[]> {
    return this.serialNoHistoryService
      .asyncAggregate([
        {
          $match: {
            serial_no: {
              $in: [serial_no],
            },
          },
        },
        {
          $group: {
            _id: '$serial_no',
            event: {
              $last: '$$ROOT',
            },
          },
        },
        {
          $project: {
            data: '$event.eventType',
            serial: {
              $cond: [
                { $ne: ['$event.parent_document', parent_document] },
                '$event.serial_no',
                '$$REMOVE',
              ],
            },
          },
        },
        {
          $group: {
            _id: '$data',
            serials: {
              $push: '$serial',
            },
          },
        },
        {
          $redact: {
            $cond: {
              if: { $gt: [{ $size: '$serials' }, 0] },
              then: '$$DESCEND',
              else: '$$PRUNE',
            },
          },
        },
      ])
      .pipe(switchMap(data => (data ? of(data) : of([]))));
  }

  validateSerialHistory(payload: CreateSalesReturnDto) {
    return from(payload.items).pipe(
      mergeMap(item => {
        if (!item.has_serial_no) {
          return of({ notFoundSerials: [] });
        }
        return this.validateHistoryEvent(
          item.serial_no.split('\n'),
          item.against_sales_invoice,
        );
      }),
      toArray(),
      switchMap(() => {
        return of(true);
      }),
    );
  }

  validateHistoryEvent(serial_no: string[], invoice_name: string) {
    return from(serial_no).pipe(
      concatMap(serial => {
        return from(
          this.serialNoHistoryService.asyncAggregate([
            { $match: { serial_no: serial_no.find(x => x) } },
            { $sort: { _id: -1 } },
            { $limit: 1 },
          ]),
        ).pipe(
          switchMap((data: SerialNoHistory[]) => {
            if (data.find(x => x).parent_document === invoice_name) {
              return of(serial);
            }
            return of(false);
          }),
        );
      }),
      toArray(),
      switchMap(historyArray => {
        if (
          historyArray.filter(ele => ele !== false).length !== serial_no.length
        ) {
          return throwError(
            new BadRequestException(`Some Serial Are already In a Claim.`),
          );
        }
        return of(true);
      }),
    );
  }
}
export interface OverlappingEventInterface {
  _id: string;
  serials: string[];
}
