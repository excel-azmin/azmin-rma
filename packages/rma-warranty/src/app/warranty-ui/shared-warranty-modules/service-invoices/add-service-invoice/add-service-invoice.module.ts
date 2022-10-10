import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddServiceInvoicePageRoutingModule } from './add-service-invoice-routing.module';

import { AddServiceInvoicePage } from './add-service-invoice.page';
import { AppCommonModule } from '../../../../common/app-common.module';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../../../material/material.module';
import { KeyDownDetectorDirective } from './on-key-down-directive';
import { InlineEditComponent } from './inline-edit/inline-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AddServiceInvoicePage,
  },
];
@NgModule({
  imports: [
    AppCommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AddServiceInvoicePageRoutingModule,
  ],
  declarations: [
    InlineEditComponent,
    AddServiceInvoicePage,
    KeyDownDetectorDirective,
  ],

  exports: [KeyDownDetectorDirective],
})
export class AddServiceInvoicePageModule {}
