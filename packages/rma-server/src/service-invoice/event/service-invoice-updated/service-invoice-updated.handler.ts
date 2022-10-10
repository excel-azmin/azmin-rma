import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ServiceInvoiceUpdatedEvent } from './service-invoice-updated.event';
import { ServiceInvoiceService } from '../../entity/service-invoice/service-invoice.service';

@EventsHandler(ServiceInvoiceUpdatedEvent)
export class ServiceInvoiceUpdatedCommandHandler
  implements IEventHandler<ServiceInvoiceUpdatedEvent> {
  constructor(private readonly object: ServiceInvoiceService) {}

  async handle(event: ServiceInvoiceUpdatedEvent) {
    const { updatePayload } = event;
    await this.object.updateOne(
      { uuid: updatePayload.uuid },
      { $set: updatePayload },
    );
  }
}
