import { CreateDeliveryNoteHandler } from './create-delivery-note/create-delivery-note.handler';
import { DeleteDeliveryNoteHandler } from './delete-delivery-note/delete-delivery-note.handler';

export const DeliveryNoteCommandHandler = [
  CreateDeliveryNoteHandler,
  DeleteDeliveryNoteHandler,
];
