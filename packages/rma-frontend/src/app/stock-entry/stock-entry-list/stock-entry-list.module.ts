import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StockEntryListPage } from './stock-entry-list.page';
import { MaterialModule } from '../../material/material.module';
import { AppCommonModule } from '../../common/app-common.module';

const routes: Routes = [
  {
    path: '',
    component: StockEntryListPage,
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
  declarations: [StockEntryListPage],
})
export class StockEntryListModule {}
