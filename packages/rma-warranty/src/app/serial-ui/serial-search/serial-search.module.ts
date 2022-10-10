import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SerialSearchPageRoutingModule } from './serial-search-routing.module';

import { SerialSearchPage } from './serial-search.page';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SerialSearchPageRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [SerialSearchPage],
})
export class SerialSearchPageModule {}
