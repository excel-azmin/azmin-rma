import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockAvailabilityPage } from './stock-availability.page';

const routes: Routes = [
  {
    path: '',
    component: StockAvailabilityPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockAvailabilityPageRoutingModule {}
