import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPurchaseInvoicePageRoutingModule } from './view-purchase-invoice-routing.module';

import { ViewPurchaseInvoicePage } from './view-purchase-invoice.page';
import { PurchaseAssignSerialsComponent } from './purchase-assign-serials/purchase-assign-serials.component';
import { PurchaseDetailsComponent } from './purchase-details/purchase-details.component';
import { MaterialModule } from '../../material/material.module';
import { AppCommonModule } from '../../common/app-common.module';
import { EditPurchaseTableComponent } from './edit-purchase-table/edit-purchase-table.component';
import { CommonComponentModule } from '../../common/components/common-component.module';

@NgModule({
  imports: [
    CommonComponentModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    AppCommonModule,
    IonicModule,
    ReactiveFormsModule,
    ViewPurchaseInvoicePageRoutingModule,
  ],
  declarations: [
    ViewPurchaseInvoicePage,
    PurchaseAssignSerialsComponent,
    PurchaseDetailsComponent,
    EditPurchaseTableComponent,
  ],
})
export class ViewPurchaseInvoicePageModule {}
