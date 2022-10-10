import { ICommand } from '@nestjs/cqrs';
import { UpdatePurchaseInvoiceDto } from '../../entity/purchase-invoice/update-purchase-invoice-dto';

export class UpdatePurchaseInvoiceCommand implements ICommand {
  constructor(public readonly updatePayload: UpdatePurchaseInvoiceDto) {}
}
