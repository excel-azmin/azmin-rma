import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSalesReturnPage } from './add-sales-return.page';

const routes: Routes = [
  {
    path: '',
    component: AddSalesReturnPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSalesReturnPageRoutingModule {}
