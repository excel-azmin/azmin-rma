import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeliveryNoteDeletedEvent } from './delivery-note-deleted-event';
import { DeliveryNoteService } from '../../entity/delivery-note-service/delivery-note.service';

@EventsHandler(DeliveryNoteDeletedEvent)
export class DeliveryNoteDeletedHandler
  implements IEventHandler<DeliveryNoteDeletedEvent> {
  constructor(private readonly noteService: DeliveryNoteService) {}

  async handle(event: DeliveryNoteDeletedEvent) {
    const { uuid } = event;
    await this.noteService.deleteOne({ uuid });
  }
}
