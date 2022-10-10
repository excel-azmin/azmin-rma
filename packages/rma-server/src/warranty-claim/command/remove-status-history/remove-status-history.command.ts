import { ICommand } from '@nestjs/cqrs';

export class RemoveStatusHistoryCommand implements ICommand {
  constructor(public uuid: string) {}
}
