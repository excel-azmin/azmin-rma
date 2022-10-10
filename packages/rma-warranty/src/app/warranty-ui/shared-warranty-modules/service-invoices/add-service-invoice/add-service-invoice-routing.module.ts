import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddServiceInvoicePage } from './add-service-invoice.page';

const routes: Routes = [
  {
    path: '',
    component: AddServiceInvoicePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddServiceInvoicePageRoutingModule {}
