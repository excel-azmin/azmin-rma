import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
  },
  {
    path: 'callback',
    loadChildren: () =>
      import('./callback/callback.module').then(m => m.CallbackPageModule),
  },
  {
    path: 'callback',
    loadChildren: () =>
      import('./callback/callback.module').then(m => m.CallbackPageModule),
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('./sales-ui/sales/sales.module').then(m => m.SalesPageModule),
  },
  {
    path: 'stock-entry',
    loadChildren: () =>
      import('./stock-entry/stock-entry-list/stock-entry-list.module').then(
        m => m.StockEntryListModule,
      ),
  },
  {
    path: 'material-transfer',
    loadChildren: () =>
      import('./stock-entry/stock-entry.module').then(m => m.StockEntryModule),
  },
  {
    path: 'material-transfer/:uuid',
    loadChildren: () =>
      import('./stock-entry/stock-entry.module').then(m => m.StockEntryModule),
  },
  {
    path: 'sales/add-sales-invoice/:calledFrom',
    loadChildren: () =>
      import('./sales-ui/add-sales-invoice/add-sales-invoice.module').then(
        m => m.AddSalesInvoicePageModule,
      ),
  },
  {
    path: 'sales/add-sales-invoice/:calledFrom/:invoiceUuid',
    loadChildren: () =>
      import('./sales-ui/add-sales-invoice/add-sales-invoice.module').then(
        m => m.AddSalesInvoicePageModule,
      ),
  },
  {
    path: 'purchase',
    loadChildren: () =>
      import('./purchase-ui/purchase/purchase.module').then(
        m => m.PurchasePageModule,
      ),
  },
  {
    path: 'sales/view-sales-invoice/:invoiceUuid',
    loadChildren: () =>
      import('./sales-ui/view-sales-invoice/view-sales-invoice.module').then(
        m => m.ViewSalesInvoicePageModule,
      ),
  },
  {
    path: 'settings/item-price',
    loadChildren: () =>
      import('./sales-ui/item-price/item-price.module').then(
        m => m.ItemPricePageModule,
      ),
  },
  {
    path: 'purchase/view-purchase-invoice/:invoiceUuid',
    loadChildren: () =>
      import(
        './purchase-ui/view-purchase-invoice/view-purchase-invoice.module'
      ).then(m => m.ViewPurchaseInvoicePageModule),
  },
  {
    path: 'sales/add-sales-return/:invoiceUuid',
    loadChildren: () =>
      import('./sales-ui/add-sales-return/add-sales-return.module').then(
        m => m.AddSalesReturnPageModule,
      ),
  },
  {
    path: 'settings/credit-limit',
    loadChildren: () =>
      import('./credit-limit/credit-limit.module').then(
        m => m.CreditLimitPageModule,
      ),
  },
  {
    path: 'settings/problem',
    loadChildren: () =>
      import('./problem-ui/problem/problem.module').then(
        m => m.ProblemPageModule,
      ),
  },
  {
    path: 'settings/terms-and-conditions',
    loadChildren: () =>
      import(
        './terms-and-conditions-ui/terms-and-conditions/terms-and-conditions.module'
      ).then(m => m.TermsAndConditionsPageModule),
  },
  {
    path: 'jobs',
    loadChildren: () =>
      import('./job-ui/jobs/jobs.module').then(m => m.JobsPageModule),
  },
  {
    path: 'view-single-job',
    loadChildren: () =>
      import('./job-ui/view-single-job/view-single-job.module').then(
        m => m.ViewSingleJobPageModule,
      ),
  },
  {
    path: 'sales-return',
    loadChildren: () =>
      import('./sales-ui/sales-return/sales-return.module').then(
        m => m.SalesReturnPageModule,
      ),
  },
  {
    path: 'sales-return/details/:name',
    loadChildren: () =>
      import(
        './sales-ui/sales-return-details/sales-return-details.module'
      ).then(m => m.SalesReturnDetailsPageModule),
  },
  {
    path: 'customer-profile',
    loadChildren: () =>
      import('./customer-profile/customer-profile.module').then(
        m => m.CustomerProfilePageModule,
      ),
  },
  {
    path: 'stock-availability',
    loadChildren: () =>
      import('./stock-entry/stock-availability/stock-availability.module').then(
        m => m.StockAvailabilityPageModule,
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
