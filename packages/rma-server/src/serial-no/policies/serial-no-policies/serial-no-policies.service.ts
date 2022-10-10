import { SerialNoHistoryService } from './../../entity/serial-no-history/serial-no-history.service';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SerialNoService } from '../../entity/serial-no/serial-no.service';
import {
  SerialNoDto,
  ValidateSerialsDto,
  ValidateReturnSerialsDto,
} from '../../entity/serial-no/serial-no-dto';
import { from, of, throwError } from 'rxjs';
import { concatMap, map, switchMap, toArray } from 'rxjs/operators';
import {
  SERIAL_NO_ALREADY_EXIST,
  ITEM_NOT_FOUND,
  SUPPLIER_NOT_FOUND,
} from '../../../constants/messages';
import { ItemService } from '../../../item/entity/item/item.service';
import { SupplierService } from '../../../supplier/entity/supplier/supplier.service';
import { EventType } from '../../../serial-no/entity/serial-no-history/serial-no-history.entity';

@Injectable()
export class SerialNoPoliciesService {
  constructor(
    private readonly serialNoService: SerialNoService,
    private readonly serialNoHistoryService: SerialNoHistoryService,
    private readonly itemService: ItemService,
    private readonly supplierService: SupplierService,
  ) {}

  validateSerial(serialProvider: SerialNoDto) {
    return from(
      this.serialNoService.findOne({ serial_no: serialProvider.serial_no }),
    ).pipe(
      switchMap(serial => {
        if (!serial) {
          return of(true);
        }
        return throwError(new BadRequestException(SERIAL_NO_ALREADY_EXIST));
      }),
    );
  }

  validateItem(serialProvider: SerialNoDto) {
    return from(
      this.itemService.findOne({ item_code: serialProvider.item_code }),
    ).pipe(
      switchMap(item => {
        if (item) {
          return of(true);
        }
        return throwError(new NotFoundException(ITEM_NOT_FOUND));
      }),
    );
  }

  validateSupplier(serialProvider: SerialNoDto) {
    return from(
      this.supplierService.findOne({ name: serialProvider.supplier }),
    ).pipe(
      switchMap(supplier => {
        if (supplier) {
          return of(true);
        }
        return throwError(new NotFoundException(SUPPLIER_NOT_FOUND));
      }),
    );
  }

  validateSerials(payload: ValidateSerialsDto) {
    return (payload.validateFor === 'purchase_receipt'
      ? this.validateSerialsForPurchaseReceipt(payload)
      : this.validateSerialsForDeliveryNote(payload)
    ).pipe(
      switchMap((data: ValidateSerialsResponse[]) => {
        if (payload.validateFor === 'purchase_receipt') {
          return of({ notFoundSerials: data[0] ? data[0].foundSerials : [] });
        } else {
          return of({
            notFoundSerials: data[0]
              ? data[0].notFoundSerials
              : payload.serials,
          });
        }
      }),
    );
  }

  validateReturnSerials(payload: ValidateReturnSerialsDto) {
    return this.serialNoService
      .asyncAggregate([
        {
          $match: {
            delivery_note: { $in: payload.delivery_note_names },
            serial_no: { $in: payload.serials },
            item_code: payload.item_code,
          },
        },
        {
          $group: {
            _id: 'validSerials',
            foundSerials: { $push: '$serial_no' },
          },
        },
        {
          $project: {
            notFoundSerials: {
              $setDifference: [payload.serials, '$foundSerials'],
            },
          },
        },
      ])
      .pipe(
        switchMap(
          (
            data: {
              _id: string;
              notFoundSerials: string[];
            }[],
          ) => {
            return of({
              notFoundSerials: data[0]
                ? data[0].notFoundSerials
                : payload.serials,
            });
          },
        ),
      );
  }

  async findInvalidCancelReturnSerials(
    serialNumbers: string[],
    salesInvoiceName: string,
  ) {
    const recentSerialNoHistories = await from(serialNumbers)
      .pipe(
        concatMap(async serialNumber => {
          return await this.serialNoHistoryService
            .asyncAggregate([
              { $match: { serial_no: serialNumber } },
              { $sort: { created_on: -1 } },
              { $limit: 1 },
            ])
            .pipe(map(histories => histories[0]))
            .toPromise();
        }),
        toArray(),
      )
      .toPromise();

    const invalidSerials = recentSerialNoHistories.filter(
      recentSerialHistory =>
        recentSerialHistory.parent_document !== salesInvoiceName ||
        recentSerialHistory.eventType !== EventType.SerialReturned,
    );

    return invalidSerials.map(invalidSerial => invalidSerial.serial_no);
  }

  validateSerialsForDeliveryNote(payload: ValidateSerialsDto) {
    if (!payload.item_code || !payload.warehouse) {
      return throwError(
        new BadRequestException(
          'Warehouse and item_code are mandatory for delivery note serial validation.',
        ),
      );
    }
    return this.serialNoService.asyncAggregate([
      {
        $match: {
          serial_no: { $in: payload.serials },
          item_code: payload.item_code,
          $or: [
            { warehouse: payload.warehouse },
            { 'queue_state.purchase_receipt.warehouse': payload.warehouse },
          ],
          'warranty.soldOn': { $exists: false },
          'queue_state.delivery_note': { $exists: false },
        },
      },
      {
        $group: {
          _id: 'validSerials',
          foundSerials: { $push: '$serial_no' },
        },
      },
      {
        $project: {
          notFoundSerials: {
            $setDifference: [payload.serials, '$foundSerials'],
          },
        },
      },
    ]);
  }

  validateSerialsForPurchaseReceipt(payload: ValidateSerialsDto) {
    return this.serialNoService.asyncAggregate([
      {
        $match: {
          serial_no: { $in: payload.serials },
          $or: [
            { 'queue_state.purchase_receipt': { $exists: true } },
            { purchase_document_no: { $exists: true } },
          ],
        },
      },
      { $limit: 5 },
      {
        $group: {
          _id: 'validSerials',
          foundSerials: { $push: '$serial_no' },
        },
      },
    ]);
  }
}

export class ValidateSerialsResponse {
  _id: string;
  notFoundSerials: string[];
  foundSerials: string[];
}
