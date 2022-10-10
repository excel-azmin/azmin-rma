import { ICommand } from '@nestjs/cqrs';
import { ServiceInvoiceDto } from '../../entity/service-invoice/service-invoice-dto';

export class AddServiceInvoiceCommand implements ICommand {
  constructor(
    public serviceInvoicePayload: ServiceInvoiceDto,
    public readonly clientHttpRequest: any,
  ) {}
}
