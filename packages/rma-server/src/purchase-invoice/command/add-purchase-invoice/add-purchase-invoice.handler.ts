import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddPurchaseInvoiceCommand } from './add-purchase-invoice.command';
import { PurchaseInvoiceAggregateService } from '../../aggregates/purchase-invoice-aggregate/purchase-invoice-aggregate.service';

@CommandHandler(AddPurchaseInvoiceCommand)
export class AddPurchaseInvoiceCommandHandler
  implements ICommandHandler<AddPurchaseInvoiceCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: PurchaseInvoiceAggregateService,
  ) {}
  async execute(command: AddPurchaseInvoiceCommand) {
    const { purchaseInvoicePayload, clientHttpRequest } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.addPurchaseInvoice(
      purchaseInvoicePayload,
      clientHttpRequest,
    );
    aggregate.commit();
  }
}
