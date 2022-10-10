import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PurchaseInvoiceUpdatedEvent } from './purchase-invoice-updated.event';
import { PurchaseInvoiceService } from '../../entity/purchase-invoice/purchase-invoice.service';

@EventsHandler(PurchaseInvoiceUpdatedEvent)
export class PurchaseInvoiceUpdatedCommandHandler
  implements IEventHandler<PurchaseInvoiceUpdatedEvent> {
  constructor(private readonly object: PurchaseInvoiceService) {}

  async handle(event: PurchaseInvoiceUpdatedEvent) {
    const { updatePayload } = event;
    await this.object.updateOne(
      { uuid: updatePayload.uuid },
      { $set: updatePayload },
    );
  }
}
