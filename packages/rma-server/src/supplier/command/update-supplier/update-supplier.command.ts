import { ICommand } from '@nestjs/cqrs';
import { UpdateSupplierDto } from '../../entity/supplier/update-supplier-dto';

export class UpdateSupplierCommand implements ICommand {
  constructor(public readonly updatePayload: UpdateSupplierDto) {}
}
