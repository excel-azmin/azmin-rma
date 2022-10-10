import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveCustomerCommand } from './remove-customer.command';
import { CustomerAggregateService } from '../../aggregates/customer-aggregate/customer-aggregate.service';

@CommandHandler(RemoveCustomerCommand)
export class RemoveCustomerHandler
  implements ICommandHandler<RemoveCustomerCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: CustomerAggregateService,
  ) {}
  async execute(command: RemoveCustomerCommand) {
    const { uuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.removeCustomer(uuid);
    aggregate.commit();
  }
}
