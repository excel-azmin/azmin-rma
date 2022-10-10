import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsAndConditionsPageRoutingModule } from './terms-and-conditions-routing.module';

import { TermsAndConditionsPage } from './terms-and-conditions.page';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsAndConditionsPageRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [TermsAndConditionsPage],
})
export class TermsAndConditionsPageModule {}
