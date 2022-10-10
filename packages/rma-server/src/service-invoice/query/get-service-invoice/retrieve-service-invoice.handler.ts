import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveServiceInvoiceQuery } from './retrieve-service-invoice.query';
import { ServiceInvoiceAggregateService } from '../../aggregates/service-invoice-aggregate/service-invoice-aggregate.service';

@QueryHandler(RetrieveServiceInvoiceQuery)
export class RetrieveServiceInvoiceQueryHandler
  implements IQueryHandler<RetrieveServiceInvoiceQuery> {
  constructor(private readonly manager: ServiceInvoiceAggregateService) {}

  async execute(query: RetrieveServiceInvoiceQuery) {
    const { req, uuid } = query;
    return this.manager.retrieveServiceInvoice(uuid, req);
  }
}
