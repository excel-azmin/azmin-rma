import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CreateDeliveryNoteCommand } from './create-delivery-note.command';
import { DeliveryNoteAggregateService } from '../../../delivery-note/aggregates/delivery-note-aggregate/delivery-note-aggregate.service';

@CommandHandler(CreateDeliveryNoteCommand)
export class CreateDeliveryNoteHandler
  implements ICommandHandler<CreateDeliveryNoteCommand> {
  constructor(
    private readonly manager: DeliveryNoteAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateDeliveryNoteCommand) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.addDeliveryNote(payload);
    aggregate.commit();
  }
}
