import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarrantyPage } from './warranty.page';

const routes: Routes = [
  {
    path: '',
    component: WarrantyPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarrantyPageRoutingModule {}
