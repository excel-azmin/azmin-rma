import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerProfilePage } from './customer-profile.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerProfilePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerProfilePageRoutingModule {}
