import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdateServiceInvoiceCommand } from './update-service-invoice.command';
import { ServiceInvoiceAggregateService } from '../../aggregates/service-invoice-aggregate/service-invoice-aggregate.service';

@CommandHandler(UpdateServiceInvoiceCommand)
export class UpdateServiceInvoiceCommandHandler
  implements ICommandHandler<UpdateServiceInvoiceCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: ServiceInvoiceAggregateService,
  ) {}

  async execute(command: UpdateServiceInvoiceCommand) {
    const { updatePayload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await this.manager.update(updatePayload);
    aggregate.commit();
  }
}
