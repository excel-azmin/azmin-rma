import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { SetWarrantyMonthsCommand } from './set-purchase-warranty-days.command';
import { ItemAggregateService } from '../../aggregates/item-aggregate/item-aggregate.service';

@CommandHandler(SetWarrantyMonthsCommand)
export class SetWarrantyMonthsHandler
  implements ICommandHandler<SetWarrantyMonthsCommand> {
  constructor(
    private readonly manager: ItemAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SetWarrantyMonthsCommand) {
    const { uuid, payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.setWarrantyMonths(uuid, payload);
    aggregate.commit();
  }
}
