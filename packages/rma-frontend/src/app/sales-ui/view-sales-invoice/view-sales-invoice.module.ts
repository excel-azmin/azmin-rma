import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewSalesInvoicePage } from './view-sales-invoice.page';
import { DetailsComponent } from './details/details.component';
import { AccountsComponent } from './accounts/accounts.component';
import { CreditNotesComponent } from './credit-notes/credit-notes.component';
import { InvoiceWarrantyComponent } from './invoice-warranty/invoice-warranty.component';
import { SalesReturnComponent } from './sales-return/sales-return.component';
import {
  SerialsComponent,
  AssignSerialsDialog,
  AssignNonSerialsItemDialog,
} from './serials/serials.component';
import { MaterialModule } from '../../material/material.module';
import { EditTableComponent } from './edit-table/edit-table.component';
import { AppCommonModule } from '../../common/app-common.module';
import { PrintComponent } from './print/print.component';
import { CommonComponentModule } from '../../common/components/common-component.module';
import { SalesReturnSerialsComponent } from './sales-return-serials/sales-return-serials.component';

const routes: Routes = [
  {
    path: '',
    component: ViewSalesInvoicePage,
  },
];

@NgModule({
  imports: [
    CommonComponentModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MaterialModule,
    AppCommonModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [AssignSerialsDialog, AssignNonSerialsItemDialog],
  declarations: [
    AssignSerialsDialog,
    AssignNonSerialsItemDialog,
    ViewSalesInvoicePage,
    DetailsComponent,
    AccountsComponent,
    CreditNotesComponent,
    InvoiceWarrantyComponent,
    SalesReturnComponent,
    SerialsComponent,
    EditTableComponent,
    PrintComponent,
    SalesReturnSerialsComponent,
  ],
})
export class ViewSalesInvoicePageModule {}
