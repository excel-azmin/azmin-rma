import { RetrieveServiceInvoiceQueryHandler } from './get-service-invoice/retrieve-service-invoice.handler';
import { RetrieveServiceInvoiceListQueryHandler } from './list-service-invoice/retrieve-service-invoice-list.handler';

export const ServiceInvoiceQueryManager = [
  RetrieveServiceInvoiceQueryHandler,
  RetrieveServiceInvoiceListQueryHandler,
];
