import { ICommand } from '@nestjs/cqrs';
import { StatusHistoryDto } from '../../entity/warranty-claim/status-history-dto';

export class AddStatusHistoryCommand implements ICommand {
  constructor(
    public statusHistoryPayload: StatusHistoryDto,
    public readonly clientHttpRequest: any,
  ) {}
}
