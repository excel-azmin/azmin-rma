import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdateSupplierCommand } from './update-supplier.command';
import { SupplierAggregateService } from '../../aggregates/supplier-aggregate/supplier-aggregate.service';

@CommandHandler(UpdateSupplierCommand)
export class UpdateSupplierHandler
  implements ICommandHandler<UpdateSupplierCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: SupplierAggregateService,
  ) {}

  async execute(command: UpdateSupplierCommand) {
    const { updatePayload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.updateSupplier(updatePayload);
    aggregate.commit();
  }
}
