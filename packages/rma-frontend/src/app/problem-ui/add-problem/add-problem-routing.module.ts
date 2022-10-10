import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProblemPage } from './add-problem.page';

const routes: Routes = [
  {
    path: '',
    component: AddProblemPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProblemPageRoutingModule {}
