import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SalesInvoiceAddedEvent } from './sales-invoice-added.event';
import { SalesInvoiceService } from '../../entity/sales-invoice/sales-invoice.service';

@EventsHandler(SalesInvoiceAddedEvent)
export class SalesInvoiceAddedHandler
  implements IEventHandler<SalesInvoiceAddedEvent> {
  constructor(private readonly salesInvoiceService: SalesInvoiceService) {}
  async handle(event: SalesInvoiceAddedEvent) {
    const { salesInvoice } = event;
    await this.salesInvoiceService.create(salesInvoice);
  }
}
