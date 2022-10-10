import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { WarrantyClaimAggregateService } from '../../aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';
import { ResetWarrantyClaimCommand } from './reset-warranty-claim.command';
@CommandHandler(ResetWarrantyClaimCommand)
export class ResetWarrantyClaimCommandHandler
  implements ICommandHandler<ResetWarrantyClaimCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: WarrantyClaimAggregateService,
  ) {}
  async execute(command: ResetWarrantyClaimCommand) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.cancelWarrantyClaim(payload).toPromise();
    aggregate.commit();
  }
}
