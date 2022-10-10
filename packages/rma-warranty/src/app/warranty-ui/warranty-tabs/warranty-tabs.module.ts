import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WarrantyTabsPage } from './warranty-tabs.page';
import { MaterialModule } from '../../material/material.module';
import { AssignClaimsComponent } from './assign-claims/assign-claims.component';
import { SerialNumberComponent } from './serial-number/serial-number.component';
import { WarrantyClaimsComponent } from './warranty-claims/warranty-claims.component';

const routes: Routes = [
  {
    path: '',
    component: WarrantyTabsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    WarrantyTabsPage,
    AssignClaimsComponent,
    SerialNumberComponent,
    WarrantyClaimsComponent,
  ],
})
export class WarrantyTabsPageModule {}
