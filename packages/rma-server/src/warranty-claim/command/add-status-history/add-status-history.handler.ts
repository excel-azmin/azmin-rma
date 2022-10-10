import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddStatusHistoryCommand } from './add-status-history.command';
import { WarrantyClaimAggregateService } from '../../aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';

@CommandHandler(AddStatusHistoryCommand)
export class AddStatusHistoryCommandHandler
  implements ICommandHandler<AddStatusHistoryCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: WarrantyClaimAggregateService,
  ) {}
  async execute(command: AddStatusHistoryCommand) {
    const { statusHistoryPayload, clientHttpRequest } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate
      .addStatusHistory(statusHistoryPayload, clientHttpRequest)
      .toPromise();
    aggregate.commit();
  }
}
