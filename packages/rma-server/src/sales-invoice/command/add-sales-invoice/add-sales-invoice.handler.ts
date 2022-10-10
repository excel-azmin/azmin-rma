import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddSalesInvoiceCommand } from './add-sales-invoice.command';
import { SalesInvoiceAggregateService } from '../../aggregates/sales-invoice-aggregate/sales-invoice-aggregate.service';

@CommandHandler(AddSalesInvoiceCommand)
export class AddSalesInvoiceHandler
  implements ICommandHandler<AddSalesInvoiceCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: SalesInvoiceAggregateService,
  ) {}
  async execute(command: AddSalesInvoiceCommand) {
    const { salesInvoicePayload, clientHttpRequest } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const salesInvoice = await aggregate
      .addSalesInvoice(salesInvoicePayload, clientHttpRequest)
      .toPromise();
    aggregate.commit();
    return salesInvoice;
  }
}
