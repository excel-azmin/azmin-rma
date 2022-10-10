import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { WarrantyTabsPageModule } from './warranty-tabs/warranty-tabs.module';
import { ViewWarrantyClaimsPageModule } from './view-warranty-claims/view-warranty-claims.module';
import { WarrantyPageModule } from './warranty/warranty.module';
import { AddWarrantyClaimPageModule } from './add-warranty-claim/add-warranty-claim.module';
import { WarrantyService } from './warranty-tabs/warranty.service';
import { AppCommonModule } from '../common/app-common.module';
@NgModule({
  declarations: [],
  imports: [
    AppCommonModule,
    CommonModule,
    MaterialModule,
    WarrantyTabsPageModule,
    ViewWarrantyClaimsPageModule,
    WarrantyPageModule,
    AddWarrantyClaimPageModule,
  ],
  exports: [WarrantyTabsPageModule, ViewWarrantyClaimsPageModule],
  providers: [WarrantyService],
})
export class WarrantyUiModule {}
