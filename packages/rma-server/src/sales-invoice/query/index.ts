import { RetrieveSalesInvoiceHandler } from './get-sales-invoice/retrieve-sales-invoice.handler';
import { RetrieveSalesInvoiceListHandler } from './list-sales-invoice/retrieve-sales-invoice-list.handler';

export const SalesInvoiceQueryManager = [
  RetrieveSalesInvoiceHandler,
  RetrieveSalesInvoiceListHandler,
];
