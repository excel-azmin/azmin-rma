import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddServiceInvoiceCommand } from './add-service-invoice.command';
import { ServiceInvoiceAggregateService } from '../../aggregates/service-invoice-aggregate/service-invoice-aggregate.service';

@CommandHandler(AddServiceInvoiceCommand)
export class AddServiceInvoiceCommandHandler
  implements ICommandHandler<AddServiceInvoiceCommand> {
  constructor(
    private publisher: EventPublisher,
    private manager: ServiceInvoiceAggregateService,
  ) {}
  async execute(command: AddServiceInvoiceCommand) {
    const { serviceInvoicePayload, clientHttpRequest } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate
      .addServiceInvoice(serviceInvoicePayload, clientHttpRequest)
      .toPromise();
    aggregate.commit();
  }
}
