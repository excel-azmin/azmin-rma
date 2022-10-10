import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SerialNoAggregateService } from '../../aggregates/serial-no-aggregate/serial-no-aggregate.service';
import { RetrieveSalesInvoiceReturnedSerialNoQuery } from './retrieve-sales-invoice-return-serial-no.query';

@QueryHandler(RetrieveSalesInvoiceReturnedSerialNoQuery)
export class RetrieveSalesInvoiceReturnedSerialNoQueryHandler
  implements IQueryHandler<RetrieveSalesInvoiceReturnedSerialNoQuery> {
  constructor(private readonly manager: SerialNoAggregateService) {}

  async execute(query: RetrieveSalesInvoiceReturnedSerialNoQuery) {
    const { salesInvoiceName, offset, limit } = query;
    return await this.manager.getSalesInvoiceReturnSerials(
      salesInvoiceName,
      offset,
      limit,
    );
  }
}
