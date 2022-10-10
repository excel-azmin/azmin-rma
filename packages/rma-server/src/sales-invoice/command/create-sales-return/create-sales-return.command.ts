import { ICommand } from '@nestjs/cqrs';
import { CreateSalesReturnDto } from '../../entity/sales-invoice/sales-return-dto';

export class CreateSalesReturnCommand implements ICommand {
  constructor(
    public readonly createReturnPayload: CreateSalesReturnDto,
    public readonly req: any,
  ) {}
}
