import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SerialInfoPage } from './serial-info.page';

const routes: Routes = [
  {
    path: '',
    component: SerialInfoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SerialInfoPageRoutingModule {}
