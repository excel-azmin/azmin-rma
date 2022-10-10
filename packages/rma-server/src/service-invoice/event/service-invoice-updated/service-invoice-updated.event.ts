import { IEvent } from '@nestjs/cqrs';
import { ServiceInvoice } from '../../entity/service-invoice/service-invoice.entity';

export class ServiceInvoiceUpdatedEvent implements IEvent {
  constructor(public updatePayload: ServiceInvoice) {}
}
