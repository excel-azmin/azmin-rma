import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddStockEntryPageRoutingModule } from './add-stock-entry-routing.module';

import { AddStockEntryPage } from './add-stock-entry.page';
import { MaterialModule } from '../../../../material/material.module';
import { AppCommonModule } from '../../../../common/app-common.module';
import { InlineEditComponent } from './inline-edit/inline-edit.component';

@NgModule({
  imports: [
    AppCommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AddStockEntryPageRoutingModule,
  ],
  declarations: [InlineEditComponent, AddStockEntryPage],
})
export class AddStockEntryPageModule {}
