import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule),
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
    path: 'sales/add-sales-return/:invoiceUuid',
    loadChildren: () =>
      import('./sales-ui/add-sales-return/add-sales-return.module').then(
        m => m.AddSalesReturnPageModule,
      ),
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
