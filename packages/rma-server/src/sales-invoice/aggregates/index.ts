import { SalesInvoiceAggregateService } from './sales-invoice-aggregate/sales-invoice-aggregate.service';
import { SalesInvoiceWebhookAggregateService } from './sales-invoice-webhook-aggregate/sales-invoice-webhook-aggregate.service';
import { SalesInvoiceResetAggregateService } from './sales-invoice-reset-aggregate/sales-invoice-reset-aggregate.service';

export const SalesInvoiceAggregatesManager = [
  SalesInvoiceAggregateService,
  SalesInvoiceWebhookAggregateService,
  SalesInvoiceResetAggregateService,
];
