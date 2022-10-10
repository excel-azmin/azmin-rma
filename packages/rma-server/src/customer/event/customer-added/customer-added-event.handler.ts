import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerAddedEvent } from './customer-added.event';
import { CustomerService } from '../../entity/customer/customer.service';

@EventsHandler(CustomerAddedEvent)
export class CustomerAddedHandler implements IEventHandler<CustomerAddedEvent> {
  constructor(private readonly customerService: CustomerService) {}
  async handle(event: CustomerAddedEvent) {
    const { customer } = event;
    await this.customerService.create(customer);
  }
}
