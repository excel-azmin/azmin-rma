import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { StorageService } from '../../api/storage/storage.service';
import {
  DEFAULT_CURRENCY_KEY,
  DEFAULT_CURRENCY,
} from '../../constants/storage';

@Pipe({
  name: 'curFormat',
})
export class CurrencyFormatPipe implements PipeTransform {
  constructor(
    private readonly storage: StorageService,
    private readonly currencyPipe: CurrencyPipe,
  ) {}
  async transform(value) {
    const currency = await this.storage.getItem(DEFAULT_CURRENCY_KEY);
    return this.currencyPipe.transform(
      value,
      currency || DEFAULT_CURRENCY,
      'symbol-narrow',
    );
  }
}
