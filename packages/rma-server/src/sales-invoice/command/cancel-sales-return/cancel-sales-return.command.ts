import { ICommand } from '@nestjs/cqrs';
import { SalesReturnCancelDto } from '../../entity/sales-invoice/sales-return-cancel-dto';

export class CancelSalesReturnCommand implements ICommand {
  constructor(
    public readonly cancelReturnDto: SalesReturnCancelDto,
    public readonly req: any,
  ) {}
}
