import { RetrievePurchaseInvoiceQueryHandler } from './get-purchase-invoice/retrieve-purchase-invoice.handler';
import { RetrievePurchaseInvoiceListQueryHandler } from './list-purchase-invoice/retrieve-purchase-invoice-list.handler';

export const PurchaseInvoiceQueryManager = [
  RetrievePurchaseInvoiceQueryHandler,
  RetrievePurchaseInvoiceListQueryHandler,
];
