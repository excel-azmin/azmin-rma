import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsAndConditionsPageModule } from './terms-and-conditions/terms-and-conditions.module';
import { AddTermsAndConditionsPageModule } from './add-terms-and-conditions/add-terms-and-conditions.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [TermsAndConditionsPageModule, AddTermsAndConditionsPageModule],
})
export class TermsAndConditionsUiModule {}
