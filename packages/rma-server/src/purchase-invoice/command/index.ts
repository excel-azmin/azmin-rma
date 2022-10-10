import { AddPurchaseInvoiceCommandHandler } from './add-purchase-invoice/add-purchase-invoice.handler';
import { RemovePurchaseInvoiceCommandHandler } from './remove-purchase-invoice/remove-purchase-invoice.handler';
import { UpdatePurchaseInvoiceCommandHandler } from './update-purchase-invoice/update-purchase-invoice.handler';

export const PurchaseInvoiceCommandManager = [
  AddPurchaseInvoiceCommandHandler,
  RemovePurchaseInvoiceCommandHandler,
  UpdatePurchaseInvoiceCommandHandler,
];
