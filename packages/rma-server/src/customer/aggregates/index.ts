import { CustomerAggregateService } from './customer-aggregate/customer-aggregate.service';
import { CustomerWebhookAggregateService } from './customer-webhook-aggregate/customer-webhook-aggregate.service';
import { TerritoryAggregateService } from './territory-aggregate/territory-aggregate.service';

export const CustomerAggregatesManager = [
  CustomerAggregateService,
  CustomerWebhookAggregateService,
  TerritoryAggregateService,
];
