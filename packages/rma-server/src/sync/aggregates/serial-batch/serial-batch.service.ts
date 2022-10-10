import { Injectable } from '@nestjs/common';
import { from, of } from 'rxjs';
import { bufferCount, mergeMap, toArray } from 'rxjs/operators';

@Injectable()
export class SerialBatchService {
  constructor() {}

  batchItems(itemsArray: ItemBatchInterface[], batchSize: number) {
    return from(itemsArray).pipe(
      mergeMap(item => {
        return this.batchSingleItem(item, batchSize);
      }),
      toArray(),
    );
  }

  batchSingleItem(item: ItemBatchInterface, batchSize: number) {
    if (!item.has_serial_no) {
      delete item.serial_no;
      return of(item);
    }
    const itemPayload = item;
    const serials = itemPayload.serial_no;
    return from(serials).pipe(
      mergeMap(serial => {
        return of(serial);
      }),
      bufferCount(batchSize),
      mergeMap(batchSerial => {
        const singleBatch: { serial_no?: any; qty?: number } = {};
        Object.assign(singleBatch, itemPayload);
        singleBatch.qty = batchSerial.length;
        singleBatch.serial_no = batchSerial.join('\n');
        return of(singleBatch);
      }),
    );
  }
}

export class ItemBatchInterface {
  item_code: string;
  serial_no?: string[];
  has_serial_no: number;
}
