import { IEvent } from '@nestjs/cqrs';
import { SalesInvoiceUpdateDto } from '../../entity/sales-invoice/sales-invoice-update-dto';

export class SalesInvoiceUpdatedEvent implements IEvent {
  constructor(public updatePayload: SalesInvoiceUpdateDto) {}
}
