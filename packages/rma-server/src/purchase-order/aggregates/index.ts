import { PurchaseOrderAggregateService } from './purchase-order-aggregate/purchase-order-aggregate.service';
import { PurchaseOrderWebhookAggregateService } from './purchase-order-webhook-aggregate/purchase-order-webhook-aggregate.service';

export const PurchaseOrderAggregates = [
  PurchaseOrderAggregateService,
  PurchaseOrderWebhookAggregateService,
];
