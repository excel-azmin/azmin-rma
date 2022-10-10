import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DeliveryNoteService } from '../../entity/delivery-note-service/delivery-note.service';
import { DeliveryNoteCreatedEvent } from './delivery-note-created-event';

@EventsHandler(DeliveryNoteCreatedEvent)
export class DeliveryNoteCreatedHandler
  implements IEventHandler<DeliveryNoteCreatedEvent> {
  constructor(private readonly noteService: DeliveryNoteService) {}

  async handle(event: DeliveryNoteCreatedEvent) {
    const { payload } = event;
    await this.noteService.create(payload);
  }
}
