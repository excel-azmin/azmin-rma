import { IEvent } from '@nestjs/cqrs';
import { SalesInvoice } from '../../entity/sales-invoice/sales-invoice.entity';

export class SalesInvoiceSubmittedEvent implements IEvent {
  constructor(public salesInvoice: SalesInvoice) {}
}
