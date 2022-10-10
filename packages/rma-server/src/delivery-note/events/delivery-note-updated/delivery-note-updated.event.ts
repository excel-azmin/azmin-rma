import { IEvent } from '@nestjs/cqrs';
import { UpdateDeliveryNoteDto } from '../../entity/delivery-note-service/update-delivery-note.dto';
export class DeliveryNoteUpdatedEvent implements IEvent {
  constructor(public updatePayload: UpdateDeliveryNoteDto) {}
}
