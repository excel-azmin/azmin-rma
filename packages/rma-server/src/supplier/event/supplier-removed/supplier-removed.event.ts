import { Supplier } from '../../entity/supplier/supplier.entity';
import { IEvent } from '@nestjs/cqrs';

export class SupplierRemovedEvent implements IEvent {
  constructor(public supplier: Supplier) {}
}
