import { PurchaseInvoiceAddedCommandHandler } from './purchase-invoice-added/purchase-invoice-added.handler';
import { PurchaseInvoiceRemovedCommandHandler } from './purchase-invoice-removed/purchase-invoice.removed.handler';
import { PurchaseInvoiceUpdatedCommandHandler } from './purchase-invoice-updated/purchase-invoice-updated.handler';

export const PurchaseInvoiceEventManager = [
  PurchaseInvoiceAddedCommandHandler,
  PurchaseInvoiceRemovedCommandHandler,
  PurchaseInvoiceUpdatedCommandHandler,
];
