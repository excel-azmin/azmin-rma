import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddSupplierCommand } from './add-supplier.command';
import { SupplierAggregateService } from '../../aggregates/supplier-aggregate/supplier-aggregate.service';

@CommandHandler(AddSupplierCommand)
export class AddSupplierHandler implements ICommandHandler<AddSupplierCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: SupplierAggregateService,
  ) {}
  async execute(command: AddSupplierCommand) {
    const { supplierPayload, clientHttpRequest } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.addSupplier(supplierPayload, clientHttpRequest);
    aggregate.commit();
  }
}
