import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { SalesInvoiceAggregateService } from '../../aggregates/sales-invoice-aggregate/sales-invoice-aggregate.service';
import { SubmitSalesInvoiceCommand } from './submit-sales-invoice.command';

@CommandHandler(SubmitSalesInvoiceCommand)
export class SubmitSalesInvoiceHandler
  implements ICommandHandler<SubmitSalesInvoiceCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: SalesInvoiceAggregateService,
  ) {}

  async execute(command: SubmitSalesInvoiceCommand) {
    const { uuid, clientHttpReq } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.submitSalesInvoice(uuid, clientHttpReq).toPromise();
    aggregate.commit();
  }
}
