import { AddSalesInvoiceHandler } from './add-sales-invoice/add-sales-invoice.handler';
import { RemoveSalesInvoiceHandler } from './remove-sales-invoice/remove-sales-invoice.handler';
import { UpdateSalesInvoiceHandler } from './update-sales-invoice/update-sales-invoice.handler';
import { SubmitSalesInvoiceHandler } from './submit-sales-invoice/submit-sales-invoice.handler';
import { CreateSalesReturnHandler } from './create-sales-return/create-sales-return.handler';
import { CancelSalesReturnHandler } from './cancel-sales-return/cancel-sales-return.handler';

export const SalesInvoiceCommandManager = [
  AddSalesInvoiceHandler,
  RemoveSalesInvoiceHandler,
  UpdateSalesInvoiceHandler,
  SubmitSalesInvoiceHandler,
  CreateSalesReturnHandler,
  CancelSalesReturnHandler,
];
