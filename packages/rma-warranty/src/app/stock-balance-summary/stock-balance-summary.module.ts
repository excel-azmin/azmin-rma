import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockBalanceSummaryPageRoutingModule } from './stock-balance-summary-routing.module';

import { StockBalanceSummaryPage } from './stock-balance-summary.page';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockBalanceSummaryPageRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [StockBalanceSummaryPage],
})
export class StockBalanceSummaryPageModule {}
