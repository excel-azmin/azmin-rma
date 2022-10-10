import { ICommand } from '@nestjs/cqrs';

export class RemoveSupplierCommand implements ICommand {
  constructor(public readonly uuid: string) {}
}
