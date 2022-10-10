import { ICommand } from '@nestjs/cqrs';

export class RemoveServiceInvoiceCommand implements ICommand {
  constructor(public readonly uuid: string) {}
}
