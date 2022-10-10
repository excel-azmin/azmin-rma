import { ICommand } from '@nestjs/cqrs';

export class CreateBulkClaimsCommand implements ICommand {
  constructor(
    public claimsPayload: any,
    public readonly clientHttpRequest: any,
  ) {}
}
