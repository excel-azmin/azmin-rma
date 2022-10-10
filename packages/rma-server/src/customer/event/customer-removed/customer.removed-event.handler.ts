import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerService } from '../../entity/customer/customer.service';
import { CustomerRemovedEvent } from './customer-removed.event';

@EventsHandler(CustomerRemovedEvent)
export class CustomerRemovedHandler
  implements IEventHandler<CustomerRemovedEvent> {
  constructor(private readonly customerService: CustomerService) {}
  async handle(event: CustomerRemovedEvent) {
    const { customer } = event;
    await this.customerService.deleteOne({ uuid: customer.uuid });
  }
}
