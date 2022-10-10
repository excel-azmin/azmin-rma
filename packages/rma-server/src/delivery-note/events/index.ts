import { DeliveryNoteUpdateHanler } from './delivery-note-updated/delivery-note-updated.handler';
import { DeliveryNoteDeletedHandler } from './delivery-note-deleted/delivery-note-deleted-handler';
import { DeliveryNoteCreatedHandler } from './delivery-note-created/delivery-note-created-handler';
export const DeliveryNoteEventManager = [
  DeliveryNoteUpdateHanler,
  DeliveryNoteCreatedHandler,
  DeliveryNoteDeletedHandler,
];
