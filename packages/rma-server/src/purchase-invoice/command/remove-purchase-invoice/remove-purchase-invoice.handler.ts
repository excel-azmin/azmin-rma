import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemovePurchaseInvoiceCommand } from './remove-purchase-invoice.command';
import { PurchaseInvoiceAggregateService } from '../../aggregates/purchase-invoice-aggregate/purchase-invoice-aggregate.service';

@CommandHandler(RemovePurchaseInvoiceCommand)
export class RemovePurchaseInvoiceCommandHandler
  implements ICommandHandler<RemovePurchaseInvoiceCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: PurchaseInvoiceAggregateService,
  ) {}
  async execute(command: RemovePurchaseInvoiceCommand) {
    const { uuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.remove(uuid);
    aggregate.commit();
  }
}
