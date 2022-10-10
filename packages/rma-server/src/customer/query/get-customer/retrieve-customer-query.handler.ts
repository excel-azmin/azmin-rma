import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveCustomerQuery } from './retrieve-customer.query';
import { CustomerAggregateService } from '../../aggregates/customer-aggregate/customer-aggregate.service';

@QueryHandler(RetrieveCustomerQuery)
export class RetrieveCustomerHandler
  implements IQueryHandler<RetrieveCustomerQuery> {
  constructor(private readonly manager: CustomerAggregateService) {}

  async execute(query: RetrieveCustomerQuery) {
    const { req, name } = query;
    return this.manager.retrieveCustomer({ name }, req);
  }
}
