import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceInvoicesPage } from './service-invoices.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceInvoicesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceInvoicesPageRoutingModule {}
