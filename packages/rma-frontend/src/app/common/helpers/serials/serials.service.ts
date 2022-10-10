import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE } from '../../../constants/app-string';
import * as _ from 'lodash';

@Injectable()
export class SerialsService {
  DEFAULT_SERIAL_RANGE = { start: 0, end: 0, prefix: '', serialPadding: 0 };
  constructor(private readonly snackBar: MatSnackBar) {}

  getSerialsFromRange(startSerial: string, endSerial: string) {
    const { start, end, prefix, serialPadding } = this.getSerialPrefix(
      startSerial,
      endSerial,
    );
    if (!this.isNumber(start) || !this.isNumber(end)) {
      this.getMessage(
        'Invalid serial range, end should be a number found character',
      );
      return [];
    }

    const data: any[] = _.range(start, end + 1);
    let i = 0;
    for (const value of data) {
      if (value !== undefined) {
        data[i] = `${prefix}${this.getPaddedNumber(value, serialPadding)}`;
        i++;
      }
    }
    return data;
  }

  isNumber(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
  }

  getMessage(notFoundMessage, expected?, found?) {
    return this.snackBar.open(notFoundMessage, CLOSE, { duration: 4500 });
    //   return this.snackBar.open(
    //     expected && found
    //       ? `${notFoundMessage}, expected ${expected} found ${found}`
    //       : `${notFoundMessage}`,
    //     CLOSE,
    //     { verticalPosition: 'top', duration: 2500 },
    //   );
  }

  getPaddedNumber(num, numberLength) {
    return _.padStart(num, numberLength, '0');
  }

  getSerialPrefix(startSerial, endSerial) {
    if (!startSerial || !endSerial) {
      return this.DEFAULT_SERIAL_RANGE;
    }

    if (startSerial.length !== endSerial.length) {
      this.getMessage('Length for From Range and To Range should be the same.');
      return this.DEFAULT_SERIAL_RANGE;
    }

    try {
      const prefix = this.getStringPrefix([startSerial, endSerial]);

      if (!prefix && (isNaN(startSerial) || isNaN(endSerial))) {
        this.getMessage('Invalid serial prefix, please enter valid serials');
        return this.DEFAULT_SERIAL_RANGE;
      }

      const serialStartNumber = startSerial.match(/\d+/g);
      const serialEndNumber = endSerial.match(/\d+/g);
      const serialPadding =
        serialEndNumber[serialEndNumber?.length - 1]?.length;

      let start = Number(
        serialStartNumber[serialStartNumber.length - 1].match(/\d+/g),
      );

      let end = Number(
        serialEndNumber[serialEndNumber.length - 1].match(/\d+/g),
      );

      if (start > end) {
        const tmp = start;
        start = end;
        end = tmp;
      }
      return { start, end, prefix, serialPadding };
    } catch {
      return this.DEFAULT_SERIAL_RANGE;
    }
  }

  getStringPrefix(arr1: string[]) {
    const arr = arr1.concat().sort(),
      fromRange = arr[0],
      toRange = arr[1],
      L = fromRange.length;
    let i = 0;
    while (i < L && fromRange.charAt(i) === toRange.charAt(i)) i++;
    const prefix = fromRange.substring(0, i).replace(/\d+$/, '');

    const fromRangePostFix = fromRange.replace(prefix, '');
    const toRangePostFix = toRange.replace(prefix, '');

    if (!/^\d+$/.test(fromRangePostFix) || !/^\d+$/.test(toRangePostFix)) {
      return false;
    }
    return prefix || '';
  }
}
