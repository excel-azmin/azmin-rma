import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SalesInvoiceSubmittedEvent } from './sales-invoice-submitted.event';
import { SalesInvoiceService } from '../../entity/sales-invoice/sales-invoice.service';
import { TO_DELIVER_STATUS } from '../../../constants/app-strings';

@EventsHandler(SalesInvoiceSubmittedEvent)
export class SalesInvoiceSubmittedHandler
  implements IEventHandler<SalesInvoiceSubmittedEvent> {
  constructor(private readonly object: SalesInvoiceService) {}

  async handle(event: SalesInvoiceSubmittedEvent) {
    const { salesInvoice: updatePayload } = event;
    await this.object.updateOne(
      { uuid: updatePayload.uuid },
      { $set: { status: TO_DELIVER_STATUS } },
    );
  }
}
