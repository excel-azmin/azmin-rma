import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewWarrantyClaimsPage } from './view-warranty-claims.page';

const routes: Routes = [
  {
    path: '',
    component: ViewWarrantyClaimsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewWarrantyClaimsPageRoutingModule {}
