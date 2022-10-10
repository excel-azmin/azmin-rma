import { SalesInvoiceResetPoliciesService } from './sales-invoice-reset-policies/sales-invoice-reset-policies.service';
import { SalesInvoicePoliciesService } from './sales-invoice-policies/sales-invoice-policies.service';

export const SalesInvoicePoliciesManager = [
  SalesInvoicePoliciesService,
  SalesInvoiceResetPoliciesService,
];
