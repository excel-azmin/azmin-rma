import { IEvent } from '@nestjs/cqrs';
import { ServiceInvoice } from '../../entity/service-invoice/service-invoice.entity';

export class ServiceInvoiceAddedEvent implements IEvent {
  constructor(
    public serviceInvoice: ServiceInvoice,
    public clientHttpRequest: any,
  ) {}
}
