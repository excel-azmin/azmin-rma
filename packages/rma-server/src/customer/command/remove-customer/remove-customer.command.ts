import { ICommand } from '@nestjs/cqrs';

export class RemoveCustomerCommand implements ICommand {
  constructor(public readonly uuid: string) {}
}
