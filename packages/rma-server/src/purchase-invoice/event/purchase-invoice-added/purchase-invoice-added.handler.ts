import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PurchaseInvoiceAddedEvent } from './purchase-invoice-added.event';
import { PurchaseInvoiceService } from '../../entity/purchase-invoice/purchase-invoice.service';

@EventsHandler(PurchaseInvoiceAddedEvent)
export class PurchaseInvoiceAddedCommandHandler
  implements IEventHandler<PurchaseInvoiceAddedEvent> {
  constructor(
    private readonly purchaseInvoiceService: PurchaseInvoiceService,
  ) {}
  async handle(event: PurchaseInvoiceAddedEvent) {
    const { purchaseInvoice } = event;
    await this.purchaseInvoiceService.create(purchaseInvoice);
  }
}
