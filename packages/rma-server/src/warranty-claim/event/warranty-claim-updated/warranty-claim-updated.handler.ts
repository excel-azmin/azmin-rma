import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WarrantyClaimUpdatedEvent } from './warranty-claim-updated.event';
import { WarrantyClaimService } from '../../entity/warranty-claim/warranty-claim.service';

@EventsHandler(WarrantyClaimUpdatedEvent)
export class WarrantyClaimUpdatedEventHandler
  implements IEventHandler<WarrantyClaimUpdatedEvent> {
  constructor(private readonly object: WarrantyClaimService) {}

  async handle(event: WarrantyClaimUpdatedEvent) {
    const { updatePayload } = event;
    await this.object.updateOne(
      { uuid: updatePayload.uuid },
      { $set: updatePayload },
    );
  }
}
