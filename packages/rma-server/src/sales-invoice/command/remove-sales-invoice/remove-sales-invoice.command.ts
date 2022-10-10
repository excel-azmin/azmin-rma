import { ICommand } from '@nestjs/cqrs';

export class RemoveSalesInvoiceCommand implements ICommand {
  constructor(public readonly uuid: string) {}
}
