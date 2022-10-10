import { ICommand } from '@nestjs/cqrs';
import { WarrantyClaimDto } from '../../entity/warranty-claim/warranty-claim-dto';

export class AddWarrantyClaimCommand implements ICommand {
  constructor(
    public warrantyclaimPayload: WarrantyClaimDto,
    public readonly clientHttpRequest: any,
  ) {}
}
