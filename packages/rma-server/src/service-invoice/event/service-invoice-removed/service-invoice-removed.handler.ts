import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ServiceInvoiceService } from '../../entity/service-invoice/service-invoice.service';
import { ServiceInvoiceRemovedEvent } from './service-invoice-removed.event';

@EventsHandler(ServiceInvoiceRemovedEvent)
export class ServiceInvoiceRemovedCommandHandler
  implements IEventHandler<ServiceInvoiceRemovedEvent> {
  constructor(private readonly serviceInvoiceService: ServiceInvoiceService) {}
  async handle(event: ServiceInvoiceRemovedEvent) {
    const { serviceInvoice } = event;
    await this.serviceInvoiceService.deleteOne({ uuid: serviceInvoice.uuid });
  }
}
