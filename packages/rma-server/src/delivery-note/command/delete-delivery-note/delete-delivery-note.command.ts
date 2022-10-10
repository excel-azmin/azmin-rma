import { ICommand } from '@nestjs/cqrs';

export class DeleteDeliveryNoteCommand implements ICommand {
  constructor(public readonly uuid: string) {}
}
