import { ICommand } from '@nestjs/cqrs';

export class SetMinimumItemPriceCommand implements ICommand {
  constructor(
    public readonly uuid: string,
    public readonly minimumPrice: number,
  ) {}
}
