import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProblemPageRoutingModule } from './problem-routing.module';

import { ProblemPage } from './problem.page';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProblemPageRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [ProblemPage],
})
export class ProblemPageModule {}
