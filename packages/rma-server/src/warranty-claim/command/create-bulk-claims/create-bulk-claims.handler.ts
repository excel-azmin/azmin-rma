import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateBulkClaimsCommand } from './create-bulk-claims.command';
import { WarrantyClaimAggregateService } from '../../aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';

@CommandHandler(CreateBulkClaimsCommand)
export class CreateBulkClaimsHandler
  implements ICommandHandler<CreateBulkClaimsCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: WarrantyClaimAggregateService,
  ) {}
  async execute(command: CreateBulkClaimsCommand) {
    const { claimsPayload, clientHttpRequest } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.addBulkClaims(claimsPayload, clientHttpRequest).toPromise();
    // .toPromise();
    aggregate.commit();
  }
}
