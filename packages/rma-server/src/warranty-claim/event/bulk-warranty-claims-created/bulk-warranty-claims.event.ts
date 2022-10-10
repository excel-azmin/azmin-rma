import { IEvent } from '@nestjs/cqrs';
import { WarrantyClaim } from '../../entity/warranty-claim/warranty-claim.entity';

export class BulkWarrantyClaimsCreatedEvent implements IEvent {
  constructor(public warrantyClaimsPayload: WarrantyClaim[]) {}
}
