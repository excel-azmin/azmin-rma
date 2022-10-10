import { ICommand } from '@nestjs/cqrs';
import { UpdateServiceInvoiceDto } from '../../entity/service-invoice/update-service-invoice-dto';

export class UpdateServiceInvoiceCommand implements ICommand {
  constructor(public readonly updatePayload: UpdateServiceInvoiceDto) {}
}
