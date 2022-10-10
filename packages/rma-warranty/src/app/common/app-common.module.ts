import { NgModule } from '@angular/core';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SerialsService } from './helpers/serials/serials.service';
import { CountDownPipe } from './pipes/countdown.pipe';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [CurrencyFormatPipe, CountDownPipe, ConfirmDialogComponent],
  providers: [CurrencyPipe, SerialsService],
  exports: [CurrencyFormatPipe, CountDownPipe, ConfirmDialogComponent],
})
export class AppCommonModule {}
