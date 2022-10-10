import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WarrantyClaimService } from '../../entity/warranty-claim/warranty-claim.service';
import { WarrantyClaimRemovedEvent } from './warranty-claim-removed.event';

@EventsHandler(WarrantyClaimRemovedEvent)
export class WarrantyClaimRemovedEventHandler
  implements IEventHandler<WarrantyClaimRemovedEvent> {
  constructor(private readonly warrantyClaimService: WarrantyClaimService) {}
  async handle(event: WarrantyClaimRemovedEvent) {
    const { warrantyclaim: warrantyclaim } = event;
    await this.warrantyClaimService.deleteOne({ uuid: warrantyclaim.uuid });
  }
}
