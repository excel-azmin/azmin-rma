import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddWarrantyClaimPage } from './add-warranty-claim.page';

const routes: Routes = [
  {
    path: '',
    component: AddWarrantyClaimPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddWarrantyClaimPageRoutingModule {}
