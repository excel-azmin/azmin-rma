import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesReturnDetailsPage } from './sales-return-details.page';

const routes: Routes = [
  {
    path: '',
    component: SalesReturnDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesReturnDetailsPageRoutingModule {}
