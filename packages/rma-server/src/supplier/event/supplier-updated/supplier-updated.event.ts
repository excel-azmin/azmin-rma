import { Supplier } from '../../entity/supplier/supplier.entity';
import { IEvent } from '@nestjs/cqrs';

export class SupplierUpdatedEvent implements IEvent {
  constructor(public updatePayload: Supplier) {}
}
