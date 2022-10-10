import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SerialNoAggregateService } from '../../aggregates/serial-no-aggregate/serial-no-aggregate.service';
import { RetrieveSalesInvoiceDeliveredSerialNoQuery } from './retrieve-sales-invoice-delivered-serial-no.query';

@QueryHandler(RetrieveSalesInvoiceDeliveredSerialNoQuery)
export class RetrieveSalesInvoiceDeliveredSerialNoQueryHandler
  implements IQueryHandler<RetrieveSalesInvoiceDeliveredSerialNoQuery> {
  constructor(private readonly manager: SerialNoAggregateService) {}

  async execute(query: RetrieveSalesInvoiceDeliveredSerialNoQuery) {
    const { offset, limit, search, find, clientHttpRequest } = query;
    return await this.manager.getSalesInvoiceDeliveryNoteSerials(
      find,
      search,
      Number(offset),
      Number(limit),
      clientHttpRequest,
    );
  }
}
