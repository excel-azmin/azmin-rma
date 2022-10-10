import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTermsAndConditionsPage } from './add-terms-and-conditions.page';

const routes: Routes = [
  {
    path: '',
    component: AddTermsAndConditionsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTermsAndConditionsPageRoutingModule {}
