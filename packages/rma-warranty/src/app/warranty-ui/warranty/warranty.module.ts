import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WarrantyPageRoutingModule } from './warranty-routing.module';
import { AssignSerialsDialog, WarrantyPage } from './warranty.page';
import { MaterialModule } from '../../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AppCommonModule } from '../../common/app-common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WarrantyPageRoutingModule,
    MaterialModule,
    HttpClientModule,
    AppCommonModule,
  ],
  entryComponents: [AssignSerialsDialog],
  declarations: [WarrantyPage, AssignSerialsDialog],
  providers: [],
})
export class WarrantyPageModule {}
