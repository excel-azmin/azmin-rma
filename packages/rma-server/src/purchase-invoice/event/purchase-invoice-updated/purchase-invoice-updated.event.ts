import { IEvent } from '@nestjs/cqrs';
import { PurchaseInvoice } from '../../entity/purchase-invoice/purchase-invoice.entity';

export class PurchaseInvoiceUpdatedEvent implements IEvent {
  constructor(public updatePayload: PurchaseInvoice) {}
}
