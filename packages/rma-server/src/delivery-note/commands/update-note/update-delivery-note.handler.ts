import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdateDeliveryNoteCommand } from './update-delivery-note.command';
import { DeliveryNoteAggregateService } from '../../aggregates/delivery-note-aggregate/delivery-note-aggregate.service';

@CommandHandler(UpdateDeliveryNoteCommand)
export class UpdateDeliveryNoteHandler
  implements ICommandHandler<UpdateDeliveryNoteCommand> {
  constructor(
    private readonly manager: DeliveryNoteAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateDeliveryNoteCommand) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.updateDeliveryNote(payload);
    aggregate.commit();
  }
}
