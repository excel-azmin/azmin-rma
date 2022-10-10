import { ICommand } from '@nestjs/cqrs';
import { SupplierDto } from '../../entity/supplier/supplier-dto';

export class AddSupplierCommand implements ICommand {
  constructor(
    public supplierPayload: SupplierDto,
    public readonly clientHttpRequest: any,
  ) {}
}
