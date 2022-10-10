import { AddServiceInvoiceCommandHandler } from './add-service-invoice/add-service-invoice.handler';
import { RemoveServiceInvoiceCommandHandler } from './remove-service-invoice/remove-service-invoice.handler';
import { UpdateServiceInvoiceCommandHandler } from './update-service-invoice/update-service-invoice.handler';

export const ServiceInvoiceCommandManager = [
  AddServiceInvoiceCommandHandler,
  RemoveServiceInvoiceCommandHandler,
  UpdateServiceInvoiceCommandHandler,
];
