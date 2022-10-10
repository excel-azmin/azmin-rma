import { ICommand } from '@nestjs/cqrs';
import { Request } from 'express';
import { UpdateCreditLimitDto } from '../../entity/customer/update-credit-limit.dto';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';

export class UpdateCreditLimitCommand implements ICommand {
  constructor(
    public readonly payload: UpdateCreditLimitDto,
    public readonly req: Request & { token: TokenCache },
  ) {}
}
