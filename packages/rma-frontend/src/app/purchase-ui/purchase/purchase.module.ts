import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PurchasePage } from './purchase.page';
import { MaterialModule } from '../../material/material.module';
import { AppCommonModule } from '../../common/app-common.module';

const routes: Routes = [
  {
    path: '',
    component: PurchasePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    AppCommonModule,
  ],
  declarations: [PurchasePage],
})
export class PurchasePageModule {}
