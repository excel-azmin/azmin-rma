import { SupplierAggregateService } from './supplier-aggregate/supplier-aggregate.service';
import { SupplierWebhookAggregateService } from './supplier-webhook-aggregate/supplier-webhook-aggregate.service';

export const SupplierAggregatesManager = [
  SupplierAggregateService,
  SupplierWebhookAggregateService,
];
