import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SerialSearchPage } from './serial-search.page';

const routes: Routes = [
  {
    path: '',
    component: SerialSearchPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SerialSearchPageRoutingModule {}
