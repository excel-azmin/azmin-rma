import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SalesInvoiceService } from '../../entity/sales-invoice/sales-invoice.service';
import { SalesInvoiceRemovedEvent } from './sales-invoice-removed.event';

@EventsHandler(SalesInvoiceRemovedEvent)
export class SalesInvoiceRemovedHandler
  implements IEventHandler<SalesInvoiceRemovedEvent> {
  constructor(private readonly salesInvoiceServer: SalesInvoiceService) {}
  async handle(event: SalesInvoiceRemovedEvent) {
    const { salesInvoice } = event;
    await this.salesInvoiceServer.deleteOne({ uuid: salesInvoice.uuid });
  }
}
