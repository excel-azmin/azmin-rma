import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AppCommonModule } from '../common/app-common.module';
import { SelectDumpHeadersDialog } from './csv-json/csv-json.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SelectDumpHeadersDialog],
  imports: [CommonModule, MaterialModule, FormsModule, AppCommonModule],
  exports: [SelectDumpHeadersDialog],
  entryComponents: [SelectDumpHeadersDialog],
  bootstrap: [SelectDumpHeadersDialog],
})
export class ApiModule {}
