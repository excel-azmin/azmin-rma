import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesReturnDetailsPageRoutingModule } from './sales-return-details-routing.module';

import { SalesReturnDetailsPage } from './sales-return-details.page';
import { MaterialModule } from '../../material/material.module';
import { AppCommonModule } from '../../common/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MaterialModule,
    AppCommonModule,
    SalesReturnDetailsPageRoutingModule,
  ],
  declarations: [SalesReturnDetailsPage],
})
export class SalesReturnDetailsPageModule {}
