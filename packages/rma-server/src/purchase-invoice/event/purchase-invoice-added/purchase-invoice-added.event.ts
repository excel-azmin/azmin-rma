import { IEvent } from '@nestjs/cqrs';
import { PurchaseInvoice } from '../../entity/purchase-invoice/purchase-invoice.entity';

export class PurchaseInvoiceAddedEvent implements IEvent {
  constructor(
    public purchaseInvoice: PurchaseInvoice,
    public clientHttpRequest: any,
  ) {}
}
