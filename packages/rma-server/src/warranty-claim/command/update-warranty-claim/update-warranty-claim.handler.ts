import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdateWarrantyClaimCommand } from './update-warranty-claim.command';
import { WarrantyClaimAggregateService } from '../../aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';

@CommandHandler(UpdateWarrantyClaimCommand)
export class UpdateWarrantyClaimCommandHandler
  implements ICommandHandler<UpdateWarrantyClaimCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: WarrantyClaimAggregateService,
  ) {}

  async execute(command: UpdateWarrantyClaimCommand) {
    const { updatePayload, req } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    switch (updatePayload.set) {
      case 'Bulk':
        await this.manager.appendBulkClaim(updatePayload, req).toPromise();
        break;
      default:
        await this.manager.update(updatePayload);
        break;
    }
    aggregate.commit();
  }
}
