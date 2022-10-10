import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { SalesInvoiceAggregateService } from '../../aggregates/sales-invoice-aggregate/sales-invoice-aggregate.service';
import { CreateSalesReturnCommand } from './create-sales-return.command';

@CommandHandler(CreateSalesReturnCommand)
export class CreateSalesReturnHandler
  implements ICommandHandler<CreateSalesReturnCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: SalesInvoiceAggregateService,
  ) {}
  async execute(command: CreateSalesReturnCommand) {
    const { createReturnPayload, req } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.createSalesReturn(createReturnPayload, req).toPromise();
    aggregate.commit();
  }
}
