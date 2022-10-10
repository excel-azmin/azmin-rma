import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulkWarrantyClaimPage } from './bulk-warranty-claim.page';

const routes: Routes = [
  {
    path: '',
    component: BulkWarrantyClaimPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BulkWarrantyClaimPageRoutingModule {}
