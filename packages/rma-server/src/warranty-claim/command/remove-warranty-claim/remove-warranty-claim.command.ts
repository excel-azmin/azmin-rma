import { ICommand } from '@nestjs/cqrs';

export class RemoveWarrantyClaimCommand implements ICommand {
  constructor(public readonly uuid: string) {}
}
