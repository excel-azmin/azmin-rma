import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasePageModule } from './purchase/purchase.module';
import { PurchaseService } from './services/purchase.service';
import { ViewPurchaseInvoicePageModule } from './view-purchase-invoice/view-purchase-invoice.module';
import { MaterialModule } from '../material/material.module';
import { CommonComponentModule } from '../common/components/common-component.module';

@NgModule({
  declarations: [],

  imports: [
    CommonComponentModule,
    CommonModule,
    PurchasePageModule,
    MaterialModule,
    ViewPurchaseInvoicePageModule,
  ],
  exports: [PurchasePageModule, ViewPurchaseInvoicePageModule],
  providers: [PurchaseService],
})
export class PurchaseUiModule {}
