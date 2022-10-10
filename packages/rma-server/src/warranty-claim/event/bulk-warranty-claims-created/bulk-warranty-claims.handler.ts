import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BulkWarrantyClaimsCreatedEvent } from './bulk-warranty-claims.event';
import { WarrantyClaimService } from '../../entity/warranty-claim/warranty-claim.service';

@EventsHandler(BulkWarrantyClaimsCreatedEvent)
export class BulkWarrantyClaimsCreatedHandler
  implements IEventHandler<BulkWarrantyClaimsCreatedEvent> {
  constructor(private readonly warrantyClaimsService: WarrantyClaimService) {}
  async handle(event: BulkWarrantyClaimsCreatedEvent) {
    const { warrantyClaimsPayload } = event;
    await this.warrantyClaimsService.insertMany(warrantyClaimsPayload);
  }
}
