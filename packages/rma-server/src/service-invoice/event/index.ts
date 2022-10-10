import { ServiceInvoiceAddedCommandHandler } from './service-invoice-added/service-invoice-added.handler';
import { ServiceInvoiceRemovedCommandHandler } from './service-invoice-removed/service-invoice-removed.handler';
import { ServiceInvoiceUpdatedCommandHandler } from './service-invoice-updated/service-invoice-updated.handler';

export const ServiceInvoiceEventManager = [
  ServiceInvoiceAddedCommandHandler,
  ServiceInvoiceRemovedCommandHandler,
  ServiceInvoiceUpdatedCommandHandler,
];
