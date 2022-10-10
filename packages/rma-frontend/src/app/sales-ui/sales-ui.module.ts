import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesPageModule } from './sales/sales.module';
import { AddSalesInvoicePageModule } from './add-sales-invoice/add-sales-invoice.module';
import { SalesService } from './services/sales.service';
import { MaterialModule } from '../material/material.module';
import { ViewSalesInvoicePageModule } from './view-sales-invoice/view-sales-invoice.module';
import { ViewSalesInvoiceSubjectService } from './view-sales-invoice/view-sales-invoice-subject.service';
import { CommonComponentModule } from '../common/components/common-component.module';

@NgModule({
  declarations: [],

  imports: [
    CommonComponentModule,
    CommonModule,
    SalesPageModule,
    AddSalesInvoicePageModule,
    MaterialModule,
    ViewSalesInvoicePageModule,
  ],
  exports: [
    SalesPageModule,
    AddSalesInvoicePageModule,
    ViewSalesInvoicePageModule,
  ],
  providers: [SalesService, ViewSalesInvoiceSubjectService],
})
export class SalesUiModule {}
