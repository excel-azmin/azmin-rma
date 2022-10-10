import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveSalesInvoiceCommand } from './remove-sales-invoice.command';
import { SalesInvoiceAggregateService } from '../../aggregates/sales-invoice-aggregate/sales-invoice-aggregate.service';

@CommandHandler(RemoveSalesInvoiceCommand)
export class RemoveSalesInvoiceHandler
  implements ICommandHandler<RemoveSalesInvoiceCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: SalesInvoiceAggregateService,
  ) {}
  async execute(command: RemoveSalesInvoiceCommand) {
    const { uuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.remove(uuid);
    aggregate.commit();
  }
}
