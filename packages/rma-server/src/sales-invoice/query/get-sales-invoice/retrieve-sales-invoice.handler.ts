import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveSalesInvoiceQuery } from './retrieve-sales-invoice.query';
import { SalesInvoiceAggregateService } from '../../aggregates/sales-invoice-aggregate/sales-invoice-aggregate.service';

@QueryHandler(RetrieveSalesInvoiceQuery)
export class RetrieveSalesInvoiceHandler
  implements IQueryHandler<RetrieveSalesInvoiceQuery> {
  constructor(
    private readonly salesInvoiceAggregateService: SalesInvoiceAggregateService,
  ) {}

  async execute(query: RetrieveSalesInvoiceQuery) {
    const { req, uuid } = query;
    return this.salesInvoiceAggregateService.retrieveSalesInvoice(uuid, req);
  }
}
