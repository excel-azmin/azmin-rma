import { IEvent } from '@nestjs/cqrs';
import { Customer } from '../../entity/customer/customer.entity';

export class CustomerUpdatedEvent implements IEvent {
  constructor(public updatePayload: Customer) {}
}
