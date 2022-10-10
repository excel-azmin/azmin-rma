import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WarrantyClaimAddedEvent } from './warranty-claim-added.event';
import { WarrantyClaimService } from '../../entity/warranty-claim/warranty-claim.service';

@EventsHandler(WarrantyClaimAddedEvent)
export class WarrantyClaimAddedEventHandler
  implements IEventHandler<WarrantyClaimAddedEvent> {
  constructor(private readonly warrantyClaimService: WarrantyClaimService) {}
  async handle(event: WarrantyClaimAddedEvent) {
    const { warrantyClaim } = event;
    await this.warrantyClaimService.create(warrantyClaim);
  }
}
