import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddWarrantyClaimCommand } from './add-warranty-claim.command';
import { WarrantyClaimAggregateService } from '../../aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';

@CommandHandler(AddWarrantyClaimCommand)
export class AddWarrantyClaimCommandHandler
  implements ICommandHandler<AddWarrantyClaimCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: WarrantyClaimAggregateService,
  ) {}
  async execute(command: AddWarrantyClaimCommand) {
    const {
      warrantyclaimPayload: warrantyclaimPayload,
      clientHttpRequest,
    } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate
      .createClaim(warrantyclaimPayload, clientHttpRequest)
      .toPromise();
    aggregate.commit();
  }
}
