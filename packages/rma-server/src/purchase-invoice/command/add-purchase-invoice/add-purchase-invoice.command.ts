import { ICommand } from '@nestjs/cqrs';
import { PurchaseInvoiceDto } from '../../entity/purchase-invoice/purchase-invoice-dto';

export class AddPurchaseInvoiceCommand implements ICommand {
  constructor(
    public purchaseInvoicePayload: PurchaseInvoiceDto,
    public readonly clientHttpRequest: any,
  ) {}
}
