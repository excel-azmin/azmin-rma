import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesReturnPageRoutingModule } from './sales-return-routing.module';

import { SalesReturnPage } from './sales-return.page';
import { MaterialModule } from '../../material/material.module';
import { AppCommonModule } from '../../common/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ReactiveFormsModule,
    AppCommonModule,
    SalesReturnPageRoutingModule,
  ],
  declarations: [SalesReturnPage],
})
export class SalesReturnPageModule {}
