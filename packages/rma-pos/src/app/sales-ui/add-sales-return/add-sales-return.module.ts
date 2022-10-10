import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSalesReturnPageRoutingModule } from './add-sales-return-routing.module';

import { AddSalesReturnPage } from './add-sales-return.page';
import { MaterialModule } from '../../material/material.module';
import { EditSalesReturnTableComponent } from './edit-sales-return-table/edit-sales-return-table.component';
import { AppCommonModule } from '../../common/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MaterialModule,
    AppCommonModule,
    AddSalesReturnPageRoutingModule,
  ],
  declarations: [AddSalesReturnPage, EditSalesReturnTableComponent],
})
export class AddSalesReturnPageModule {}
