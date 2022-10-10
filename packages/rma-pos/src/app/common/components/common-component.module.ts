import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../material/material.module';
import { AppCommonModule } from '../app-common.module';
import { AssignSerialComponent } from './assign-serial/assign-serial.component';
import { DeliveredSerialsComponent } from './delivered-serials/delivered-serials.component';

@NgModule({
  declarations: [AssignSerialComponent, DeliveredSerialsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    IonicModule,
    AppCommonModule,
    FormsModule,
  ],
  providers: [],
  exports: [AssignSerialComponent, DeliveredSerialsComponent],
})
export class CommonComponentModule {}
