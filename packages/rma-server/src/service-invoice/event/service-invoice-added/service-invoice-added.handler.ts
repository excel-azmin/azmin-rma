import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ServiceInvoiceAddedEvent } from './service-invoice-added.event';
import { ServiceInvoiceService } from '../../entity/service-invoice/service-invoice.service';

@EventsHandler(ServiceInvoiceAddedEvent)
export class ServiceInvoiceAddedCommandHandler
  implements IEventHandler<ServiceInvoiceAddedEvent> {
  constructor(private readonly serviceInvoiceService: ServiceInvoiceService) {}
  async handle(event: ServiceInvoiceAddedEvent) {
    const { serviceInvoice } = event;
    await this.serviceInvoiceService.create(serviceInvoice);
  }
}
