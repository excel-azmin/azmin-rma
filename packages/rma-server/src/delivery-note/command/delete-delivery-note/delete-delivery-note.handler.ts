import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteDeliveryNoteCommand } from './delete-delivery-note.command';
import { DeliveryNoteAggregateService } from '../../../delivery-note/aggregates/delivery-note-aggregate/delivery-note-aggregate.service';

@CommandHandler(DeleteDeliveryNoteCommand)
export class DeleteDeliveryNoteHandler
  implements ICommandHandler<DeleteDeliveryNoteCommand> {
  constructor(
    private readonly manager: DeliveryNoteAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: DeleteDeliveryNoteCommand) {
    const { uuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.deleteDeliveryNote(uuid);
    aggregate.commit();
  }
}
