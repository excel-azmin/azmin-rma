import { ICommand } from '@nestjs/cqrs';

export class RemovePurchaseInvoiceCommand implements ICommand {
  constructor(public readonly uuid: string) {}
}
