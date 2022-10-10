import { ICommand } from '@nestjs/cqrs';
import { UpdateCustomerDto } from '../../entity/customer/update-customer-dto';

export class UpdateCustomerCommand implements ICommand {
  constructor(public readonly updatePayload: UpdateCustomerDto) {}
}
