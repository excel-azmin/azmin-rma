import { ICommand } from '@nestjs/cqrs';
import { SalesInvoiceDto } from '../../entity/sales-invoice/sales-invoice-dto';

export class AddSalesInvoiceCommand implements ICommand {
  constructor(
    public salesInvoicePayload: SalesInvoiceDto,
    public readonly clientHttpRequest: any,
  ) {}
}
