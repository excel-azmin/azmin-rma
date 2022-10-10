import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesReturnPage } from './sales-return.page';

const routes: Routes = [
  {
    path: '',
    component: SalesReturnPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesReturnPageRoutingModule {}
