import { IEvent } from '@nestjs/cqrs';
import { WarrantyClaim } from '../../entity/warranty-claim/warranty-claim.entity';

export class WarrantyClaimAddedEvent implements IEvent {
  constructor(
    public warrantyClaim: WarrantyClaim,
    public clientHttpRequest: any,
  ) {}
}
