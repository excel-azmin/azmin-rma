import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { SetMinimumItemPriceCommand } from './set-minimum-item-price.command';
import { ItemAggregateService } from '../../aggregates/item-aggregate/item-aggregate.service';

@CommandHandler(SetMinimumItemPriceCommand)
export class SetMinimumItemPriceHandler
  implements ICommandHandler<SetMinimumItemPriceCommand> {
  constructor(
    private readonly manager: ItemAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SetMinimumItemPriceCommand) {
    const { uuid, minimumPrice } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.setMinPrice(uuid, minimumPrice);
    aggregate.commit();
  }
}
