import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTermsAndConditionsPageRoutingModule } from './add-terms-and-conditions-routing.module';

import { AddTermsAndConditionsPage } from './add-terms-and-conditions.page';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTermsAndConditionsPageRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [AddTermsAndConditionsPage],
})
export class AddTermsAndConditionsPageModule {}
