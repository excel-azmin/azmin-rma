import { ItemAggregateService } from './item-aggregate/item-aggregate.service';
import { ItemWebhookAggregateService } from './item-webhook-aggregate/item-webhook-aggregate.service';

export const ItemAggregatesManager = [
  ItemAggregateService,
  ItemWebhookAggregateService,
];
