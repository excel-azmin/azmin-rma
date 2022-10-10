import { IEvent } from '@nestjs/cqrs';
import { SalesInvoice } from '../../entity/sales-invoice/sales-invoice.entity';

export class SalesInvoiceAddedEvent implements IEvent {
  constructor(
    public salesInvoice: SalesInvoice,
    public clientHttpRequest: any,
  ) {}
}
