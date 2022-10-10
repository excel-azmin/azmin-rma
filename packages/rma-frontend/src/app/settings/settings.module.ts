import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';
import { MaterialModule } from '../material/material.module';
import { MapTerritoryComponent } from './map-territory/map-territory.component';
import { SettingsService } from './settings.service';
import { MapTerritoryService } from './map-territory/map-territory.service';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MaterialModule,
  ],
  entryComponents: [MapTerritoryComponent],
  declarations: [SettingsPage, MapTerritoryComponent],
  providers: [SettingsService, MapTerritoryService],
})
export class SettingsPageModule {}
