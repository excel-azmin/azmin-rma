import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RemoveStatusHistoryCommand } from './remove-status-history.command';
import { WarrantyClaimAggregateService } from '../../aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';

@CommandHandler(RemoveStatusHistoryCommand)
export class RemoveStatusHistoryCommandHandler
  implements ICommandHandler<RemoveStatusHistoryCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: WarrantyClaimAggregateService,
  ) {}
  async execute(command: RemoveStatusHistoryCommand) {
    const { uuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.removeStatusHistory(uuid).toPromise();
    aggregate.commit();
  }
}
