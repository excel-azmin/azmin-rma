import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobsPageRoutingModule } from './jobs-routing.module';

import { JobsPage } from './jobs.page';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    JobsPageRoutingModule,
    MaterialModule,
  ],
  declarations: [JobsPage],
})
export class JobsPageModule {}
