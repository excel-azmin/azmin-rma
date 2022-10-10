import { PurchaseInvoiceAggregateService } from './purchase-invoice-aggregate/purchase-invoice-aggregate.service';
import { PurchaseInvoiceWebhookAggregateService } from './purchase-invoice-webhook-aggregate/purchase-invoice-webhook-aggregate.service';

export const PurchaseInvoiceAggregatesManager = [
  PurchaseInvoiceAggregateService,
  PurchaseInvoiceWebhookAggregateService,
];
