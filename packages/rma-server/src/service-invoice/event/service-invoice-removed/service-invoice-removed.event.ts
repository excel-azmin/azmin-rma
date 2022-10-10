import { IEvent } from '@nestjs/cqrs';
import { ServiceInvoice } from '../../entity/service-invoice/service-invoice.entity';

export class ServiceInvoiceRemovedEvent implements IEvent {
  constructor(public serviceInvoice: ServiceInvoice) {}
}
