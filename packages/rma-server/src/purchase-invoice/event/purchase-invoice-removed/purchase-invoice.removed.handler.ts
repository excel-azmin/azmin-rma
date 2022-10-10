import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PurchaseInvoiceService } from '../../entity/purchase-invoice/purchase-invoice.service';
import { PurchaseInvoiceRemovedEvent } from './purchase-invoice-removed.event';

@EventsHandler(PurchaseInvoiceRemovedEvent)
export class PurchaseInvoiceRemovedCommandHandler
  implements IEventHandler<PurchaseInvoiceRemovedEvent> {
  constructor(
    private readonly purchaseInvoiceService: PurchaseInvoiceService,
  ) {}
  async handle(event: PurchaseInvoiceRemovedEvent) {
    const { purchaseInvoice } = event;
    await this.purchaseInvoiceService.deleteOne({ uuid: purchaseInvoice.uuid });
  }
}
