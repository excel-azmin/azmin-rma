import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockAvailabilityPageRoutingModule } from './stock-availability-routing.module';

import { StockAvailabilityPage } from './stock-availability.page';
import { MaterialModule } from '../../material/material.module';
import { AppCommonModule } from '../../common/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockAvailabilityPageRoutingModule,
    AppCommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [StockAvailabilityPage],
})
export class StockAvailabilityPageModule {}
