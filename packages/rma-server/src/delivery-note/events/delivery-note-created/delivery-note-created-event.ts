import { IEvent } from '@nestjs/cqrs';
import { DeliveryNote } from '../../entity/delivery-note-service/delivery-note.entity';

export class DeliveryNoteCreatedEvent implements IEvent {
  constructor(public payload: DeliveryNote) {}
}
