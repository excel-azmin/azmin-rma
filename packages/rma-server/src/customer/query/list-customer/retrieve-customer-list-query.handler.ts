import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveCustomerListQuery } from './retrieve-customer-list.query';
import { CustomerAggregateService } from '../../aggregates/customer-aggregate/customer-aggregate.service';

@QueryHandler(RetrieveCustomerListQuery)
export class RetrieveCustomerListHandler
  implements IQueryHandler<RetrieveCustomerListQuery> {
  constructor(private readonly manager: CustomerAggregateService) {}

  async execute(query: RetrieveCustomerListQuery) {
    const { offset, limit, search, sort, clientHttpRequest } = query;
    return await this.manager.getCustomerList(
      Number(offset),
      Number(limit),
      search,
      sort.toUpperCase(),
      clientHttpRequest,
    );
  }
}
