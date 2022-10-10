import { ICommand } from '@nestjs/cqrs';
import { SalesInvoiceUpdateDto } from '../../entity/sales-invoice/sales-invoice-update-dto';

export class UpdateSalesInvoiceCommand implements ICommand {
  constructor(
    public readonly updatePayload: SalesInvoiceUpdateDto,
    public readonly clientHttpRequest: any,
  ) {}
}
