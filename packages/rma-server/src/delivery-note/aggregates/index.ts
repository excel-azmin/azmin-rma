import { DeliveryNoteWebhookAggregateService } from './delivery-note-webhook-aggregate/delivery-note-webhook-aggregate.service';
import { DeliveryNoteAggregateService } from './delivery-note-aggregate/delivery-note-aggregate.service';

export const DeliveryNoteAggregatesManager = [
  DeliveryNoteWebhookAggregateService,
  DeliveryNoteAggregateService,
];
