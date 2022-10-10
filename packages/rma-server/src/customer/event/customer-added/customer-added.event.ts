import { IEvent } from '@nestjs/cqrs';
import { Customer } from '../../entity/customer/customer.entity';

export class CustomerAddedEvent implements IEvent {
  constructor(public customer: Customer, public clientHttpRequest: any) {}
}
