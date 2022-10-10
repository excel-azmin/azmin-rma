import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { DeliveryNoteUpdatedEvent } from './delivery-note-updated.event';
import { DeliveryNoteService } from '../../entity/delivery-note-service/delivery-note.service';
@EventsHandler(DeliveryNoteUpdatedEvent)
export class DeliveryNoteUpdateHanler
  implements IEventHandler<DeliveryNoteUpdatedEvent> {
  constructor(private readonly updateNoteService: DeliveryNoteService) {}

  async handle(event: DeliveryNoteUpdatedEvent) {
    const { updatePayload } = event;
    await this.updateNoteService.updateOne(
      { uuid: updatePayload.uuid },
      { $set: updatePayload },
    );
  }
}
