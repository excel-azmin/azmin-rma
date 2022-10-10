import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditLimitPage } from './credit-limit.page';

const routes: Routes = [
  {
    path: '',
    component: CreditLimitPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditLimitPageRoutingModule {}
