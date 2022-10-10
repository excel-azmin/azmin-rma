import { ICommand } from '@nestjs/cqrs';

export class ResetWarrantyClaimCommand implements ICommand {
  constructor(public readonly payload: { uuid: string; serial_no: string }) {}
}
