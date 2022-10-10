import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveServiceInvoiceListQuery } from './retrieve-service-invoice-list.query';
import { ServiceInvoiceAggregateService } from '../../aggregates/service-invoice-aggregate/service-invoice-aggregate.service';

@QueryHandler(RetrieveServiceInvoiceListQuery)
export class RetrieveServiceInvoiceListQueryHandler
  implements IQueryHandler<RetrieveServiceInvoiceListQuery> {
  constructor(private readonly manager: ServiceInvoiceAggregateService) {}
  async execute(query: RetrieveServiceInvoiceListQuery) {
    const { offset, limit, search, sort, clientHttpRequest } = query;
    return await this.manager.getServiceInvoiceList(
      Number(offset),
      Number(limit),
      search,
      sort,
      clientHttpRequest,
    );
  }
}
