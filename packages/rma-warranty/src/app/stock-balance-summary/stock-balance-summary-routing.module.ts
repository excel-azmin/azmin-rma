import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockBalanceSummaryPage } from './stock-balance-summary.page';

const routes: Routes = [
  {
    path: '',
    component: StockBalanceSummaryPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockBalanceSummaryPageRoutingModule {}
