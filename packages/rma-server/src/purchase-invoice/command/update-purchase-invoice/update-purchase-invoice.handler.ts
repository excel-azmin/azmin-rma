import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdatePurchaseInvoiceCommand } from './update-purchase-invoice.command';
import { PurchaseInvoiceAggregateService } from '../../aggregates/purchase-invoice-aggregate/purchase-invoice-aggregate.service';

@CommandHandler(UpdatePurchaseInvoiceCommand)
export class UpdatePurchaseInvoiceCommandHandler
  implements ICommandHandler<UpdatePurchaseInvoiceCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: PurchaseInvoiceAggregateService,
  ) {}

  async execute(command: UpdatePurchaseInvoiceCommand) {
    const { updatePayload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.update(updatePayload);
    aggregate.commit();
  }
}
