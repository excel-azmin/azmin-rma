import { IEvent } from '@nestjs/cqrs';
import { Supplier } from '../../entity/supplier/supplier.entity';

export class SupplierAddedEvent implements IEvent {
  constructor(public supplier: Supplier, public clientHttpRequest: any) {}
}
