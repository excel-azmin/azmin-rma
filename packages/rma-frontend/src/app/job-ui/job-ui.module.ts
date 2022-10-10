import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { JobsPageModule } from './jobs/jobs.module';
import { JobsService } from './jobs-service/jobs.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, MaterialModule, JobsPageModule],
  providers: [JobsService],
  exports: [JobsPageModule],
})
export class JobUIModule {}
