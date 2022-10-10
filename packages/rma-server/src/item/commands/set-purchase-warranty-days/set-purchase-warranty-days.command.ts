import { ICommand } from '@nestjs/cqrs';
import { SetWarrantyMonthsDto } from '../../entity/item/set-warranty-months-dto';

export class SetWarrantyMonthsCommand implements ICommand {
  constructor(
    public readonly uuid: string,
    public readonly payload: SetWarrantyMonthsDto,
  ) {}
}
