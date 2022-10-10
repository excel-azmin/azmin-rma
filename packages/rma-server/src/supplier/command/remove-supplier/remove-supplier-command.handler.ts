import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveSupplierCommand } from './remove-supplier.command';
import { SupplierAggregateService } from '../../aggregates/supplier-aggregate/supplier-aggregate.service';

@CommandHandler(RemoveSupplierCommand)
export class RemoveSupplierHandler
  implements ICommandHandler<RemoveSupplierCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: SupplierAggregateService,
  ) {}
  async execute(command: RemoveSupplierCommand) {
    const { uuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.removeSupplier(uuid);
    aggregate.commit();
  }
}
