import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProblemPageRoutingModule } from './add-problem-routing.module';

import { AddProblemPage } from './add-problem.page';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProblemPageRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [AddProblemPage],
})
export class AddProblemPageModule {}
