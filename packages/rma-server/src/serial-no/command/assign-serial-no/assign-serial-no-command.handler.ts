import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AssignSerialNoCommand } from './assign-serial-no.command';
import { SerialNoAggregateService } from '../../aggregates/serial-no-aggregate/serial-no-aggregate.service';

@CommandHandler(AssignSerialNoCommand)
export class AssignSerialNoHandler
  implements ICommandHandler<AssignSerialNoCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: SerialNoAggregateService,
  ) {}

  async execute(command: AssignSerialNoCommand) {
    const { assignPayload, clientHttpRequest } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager
      .assignSerial(assignPayload, clientHttpRequest)
      .toPromise();
    aggregate.commit();
  }
}
