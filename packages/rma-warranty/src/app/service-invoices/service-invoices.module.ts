import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceInvoicesPageRoutingModule } from './service-invoices-routing.module';
import { MaterialModule } from '../material/material.module';

import { ServiceInvoicesPage } from './service-invoices.page';
import { AppCommonModule } from '../common/app-common.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ServiceInvoicesPageRoutingModule,
    MaterialModule,
    HttpClientModule,
    AppCommonModule,
    RouterModule,
  ],
  declarations: [ServiceInvoicesPage],
})
export class ServiceInvoicesPageModule {}
