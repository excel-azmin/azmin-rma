import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditLimitPageRoutingModule } from './credit-limit-routing.module';

import { CreditLimitPage } from './credit-limit.page';
import { MaterialModule } from '../material/material.module';
import { AppCommonModule } from '../common/app-common.module';
import { UpdateCreditLimitComponent } from './update-credit-limit/update-credit-limit.component';
import { UpdateCreditLimitService } from './update-credit-limit/update-credit-limit.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditLimitPageRoutingModule,
    MaterialModule,
    AppCommonModule,
    ReactiveFormsModule,
  ],
  providers: [UpdateCreditLimitService],
  declarations: [CreditLimitPage, UpdateCreditLimitComponent],
})
export class CreditLimitPageModule {}
