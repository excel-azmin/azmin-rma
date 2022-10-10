import { ICommand } from '@nestjs/cqrs';
import { WarrantyClaimDto } from '../../entity/warranty-claim/warranty-claim-dto';

export class UpdateWarrantyClaimCommand implements ICommand {
  constructor(
    public readonly updatePayload: WarrantyClaimDto,
    public readonly req: any,
  ) {}
}
