import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemPageModule } from './problem/problem.module';
import { AddProblemPageModule } from './add-problem/add-problem.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [ProblemPageModule, AddProblemPageModule],
})
export class ProblemUiModule {}
