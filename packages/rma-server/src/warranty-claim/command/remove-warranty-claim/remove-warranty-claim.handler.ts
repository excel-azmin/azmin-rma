import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveWarrantyClaimCommand } from './remove-warranty-claim.command';
import { WarrantyClaimAggregateService } from '../../aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';

@CommandHandler(RemoveWarrantyClaimCommand)
export class RemoveWarrantyClaimCommandHandler
  implements ICommandHandler<RemoveWarrantyClaimCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: WarrantyClaimAggregateService,
  ) {}
  async execute(command: RemoveWarrantyClaimCommand) {
    const { uuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.remove(uuid);
    aggregate.commit();
  }
}
