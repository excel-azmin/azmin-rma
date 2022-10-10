import { IEvent } from '@nestjs/cqrs';
import { WarrantyClaim } from '../../entity/warranty-claim/warranty-claim.entity';

export class WarrantyClaimRemovedEvent implements IEvent {
  constructor(public warrantyclaim: WarrantyClaim) {}
}
