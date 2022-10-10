import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewSingleJobPage } from './view-single-job.page';

const routes: Routes = [
  {
    path: 'view-single-job',
    component: ViewSingleJobPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSingleJobPageRoutingModule {}
