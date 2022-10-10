import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SalesInvoiceUpdatedEvent } from './sales-invoice-updated.event';
import { SalesInvoiceService } from '../../entity/sales-invoice/sales-invoice.service';

@EventsHandler(SalesInvoiceUpdatedEvent)
export class SalesInvoiceUpdatedHandler
  implements IEventHandler<SalesInvoiceUpdatedEvent> {
  constructor(private readonly object: SalesInvoiceService) {}

  async handle(event: SalesInvoiceUpdatedEvent) {
    const { updatePayload } = event;
    await this.object.updateOne(
      { uuid: updatePayload.uuid },
      { $set: updatePayload },
    );
  }
}
