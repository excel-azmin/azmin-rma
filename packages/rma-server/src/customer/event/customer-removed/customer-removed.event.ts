import { IEvent } from '@nestjs/cqrs';
import { Customer } from '../../entity/customer/customer.entity';

export class CustomerRemovedEvent implements IEvent {
  constructor(public customer: Customer) {}
}
