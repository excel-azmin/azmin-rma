import { NgModule } from '@angular/core';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SerialsService } from './helpers/serials/serials.service';
import { CountDownPipe } from './pipes/countdown.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [CurrencyFormatPipe, CountDownPipe],
  providers: [CurrencyPipe, SerialsService],
  exports: [CurrencyFormatPipe, CountDownPipe],
})
export class AppCommonModule {}
