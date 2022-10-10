import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewSingleJobPageRoutingModule } from './view-single-job-routing.module';

import { ViewSingleJobPage } from './view-single-job.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewSingleJobPageRoutingModule,
  ],
  declarations: [ViewSingleJobPage],
})
export class ViewSingleJobPageModule {}
