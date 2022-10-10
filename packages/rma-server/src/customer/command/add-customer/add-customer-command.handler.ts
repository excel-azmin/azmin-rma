import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddCustomerCommand } from './add-customer.command';
import { CustomerAggregateService } from '../../aggregates/customer-aggregate/customer-aggregate.service';

@CommandHandler(AddCustomerCommand)
export class AddCustomerHandler implements ICommandHandler<AddCustomerCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: CustomerAggregateService,
  ) {}
  async execute(command: AddCustomerCommand) {
    const { customerPayload, clientHttpRequest } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.addCustomer(customerPayload, clientHttpRequest);
    aggregate.commit();
  }
}
