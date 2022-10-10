import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerProfilePageRoutingModule } from './customer-profile-routing.module';

import { CustomerProfilePage } from './customer-profile.page';
import { MaterialModule } from '../material/material.module';
import { AppCommonModule } from '../common/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerProfilePageRoutingModule,
    AppCommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [CustomerProfilePage],
})
export class CustomerProfilePageModule {}
