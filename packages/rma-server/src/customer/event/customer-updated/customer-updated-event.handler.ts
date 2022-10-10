import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerService } from '../../entity/customer/customer.service';
import { CustomerUpdatedEvent } from './customer-updated.event';

@EventsHandler(CustomerUpdatedEvent)
export class CustomerUpdatedHandler
  implements IEventHandler<CustomerUpdatedEvent> {
  constructor(private readonly object: CustomerService) {}

  async handle(event: CustomerUpdatedEvent) {
    const { updatePayload } = event;
    await this.object.updateOne(
      { uuid: updatePayload.uuid },
      { $set: updatePayload },
    );
  }
}
