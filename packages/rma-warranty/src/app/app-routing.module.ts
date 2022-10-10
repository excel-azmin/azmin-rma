import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SystemManagerGuard } from './common/guards/system-manager.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule),
  },

  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then(m => m.SettingsPageModule),
    canActivate: [SystemManagerGuard],
  },
  {
    path: 'callback',
    loadChildren: () =>
      import('./callback/callback.module').then(m => m.CallbackPageModule),
  },
  {
    path: 'balance-summary',
    loadChildren: () =>
      import('./stock-balance-summary/stock-balance-summary.module').then(
        m => m.StockBalanceSummaryPageModule,
      ),
  },
  {
    path: 'callback',
    loadChildren: () =>
      import('./callback/callback.module').then(m => m.CallbackPageModule),
  },
  {
    path: 'warranty',
    loadChildren: () =>
      import('./warranty-ui/warranty/warranty.module').then(
        m => m.WarrantyPageModule,
      ),
  },
  {
    path: 'warranty/edit-warranty-claim/:uuid',
    loadChildren: () =>
      import('./warranty-ui/add-warranty-claim/add-warranty-claim.module').then(
        m => m.AddWarrantyClaimPageModule,
      ),
  },
  {
    path: 'warranty/add-warranty-claim',
    loadChildren: () =>
      import('./warranty-ui/add-warranty-claim/add-warranty-claim.module').then(
        m => m.AddWarrantyClaimPageModule,
      ),
  },
  {
    path: 'warranty-tabs/:calledFrom',
    loadChildren: () =>
      import('./warranty-ui/warranty-tabs/warranty-tabs.module').then(
        m => m.WarrantyTabsPageModule,
      ),
  },
  {
    path: 'warranty/view-warranty-claims/:uuid',
    loadChildren: () =>
      import(
        './warranty-ui/view-warranty-claims/view-warranty-claims.module'
      ).then(m => m.ViewWarrantyClaimsPageModule),
  },
  {
    path: 'add-warranty-claim',
    loadChildren: () =>
      import('./warranty-ui/add-warranty-claim/add-warranty-claim.module').then(
        m => m.AddWarrantyClaimPageModule,
      ),
  },
  {
    path: 'warranty/service-invoice/:name/:uuid',
    loadChildren: () =>
      import(
        './warranty-ui/shared-warranty-modules/service-invoices/add-service-invoice/add-service-invoice.module'
      ).then(m => m.AddServiceInvoicePageModule),
  },
  {
    path: 'warranty/stock-entry/:name/:uuid',
    loadChildren: () =>
      import(
        './warranty-ui/view-warranty-claims/stock-entry/add-stock-entry/add-stock-entry.module'
      ).then(m => m.AddStockEntryPageModule),
  },
  {
    path: 'serial-search',
    loadChildren: () =>
      import('./serial-ui/serial-search/serial-search.module').then(
        m => m.SerialSearchPageModule,
      ),
  },
  {
    path: 'serial-info/:serial',
    loadChildren: () =>
      import('./serial-ui/serial-info/serial-info.module').then(
        m => m.SerialInfoPageModule,
      ),
  },
  {
    path: 'bulk-warranty-claim/:name/:uuid',
    loadChildren: () =>
      import(
        './warranty-ui/bulk-warranty-claim/bulk-warranty-claim.module'
      ).then(m => m.BulkWarrantyClaimPageModule),
  },
  {
    path: 'service-invoice',
    loadChildren: () =>
      import('./service-invoices/service-invoices.module').then(
        m => m.ServiceInvoicesPageModule,
      ),
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
