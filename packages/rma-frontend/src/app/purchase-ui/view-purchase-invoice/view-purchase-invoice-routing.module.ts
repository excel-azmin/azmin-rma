import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPurchaseInvoicePage } from './view-purchase-invoice.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPurchaseInvoicePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPurchaseInvoicePageRoutingModule {}
