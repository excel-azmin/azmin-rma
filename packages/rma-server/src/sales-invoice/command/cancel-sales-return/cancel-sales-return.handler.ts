import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { SalesInvoiceAggregateService } from '../../aggregates/sales-invoice-aggregate/sales-invoice-aggregate.service';
import { CancelSalesReturnCommand } from './cancel-sales-return.command';

@CommandHandler(CancelSalesReturnCommand)
export class CancelSalesReturnHandler
  implements ICommandHandler<CancelSalesReturnCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: SalesInvoiceAggregateService,
  ) {}
  async execute(command: CancelSalesReturnCommand) {
    const { cancelReturnDto, req } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.cancelSalesReturn(cancelReturnDto, req);
    aggregate.commit();
  }
}
