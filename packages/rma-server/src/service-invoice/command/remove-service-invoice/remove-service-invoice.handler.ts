import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveServiceInvoiceCommand } from './remove-service-invoice.command';
import { ServiceInvoiceAggregateService } from '../../aggregates/service-invoice-aggregate/service-invoice-aggregate.service';

@CommandHandler(RemoveServiceInvoiceCommand)
export class RemoveServiceInvoiceCommandHandler
  implements ICommandHandler<RemoveServiceInvoiceCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: ServiceInvoiceAggregateService,
  ) {}
  async execute(command: RemoveServiceInvoiceCommand) {
    const { uuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.remove(uuid);
    aggregate.commit();
  }
}
