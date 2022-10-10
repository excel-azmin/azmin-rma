import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { SalesInvoiceAggregateService } from '../../aggregates/sales-invoice-aggregate/sales-invoice-aggregate.service';
import { UpdateSalesInvoiceCommand } from './update-sales-invoice.command';

@CommandHandler(UpdateSalesInvoiceCommand)
export class UpdateSalesInvoiceHandler
  implements ICommandHandler<UpdateSalesInvoiceCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: SalesInvoiceAggregateService,
  ) {}

  async execute(command: UpdateSalesInvoiceCommand) {
    const { updatePayload, clientHttpRequest } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.update(updatePayload, clientHttpRequest);
    aggregate.commit();
    return updatePayload;
  }
}
