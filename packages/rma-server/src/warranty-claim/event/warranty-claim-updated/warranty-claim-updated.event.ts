import { IEvent } from '@nestjs/cqrs';
import { WarrantyClaim } from '../../entity/warranty-claim/warranty-claim.entity';

export class WarrantyClaimUpdatedEvent implements IEvent {
  constructor(public updatePayload: WarrantyClaim) {}
}
