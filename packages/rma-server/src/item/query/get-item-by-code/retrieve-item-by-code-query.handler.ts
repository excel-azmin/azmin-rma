import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveItemByCodeQuery } from './retrieve-item-by-code-.query';
import { ItemAggregateService } from '../../aggregates/item-aggregate/item-aggregate.service';

@QueryHandler(RetrieveItemByCodeQuery)
export class RetrieveItemByCodeHandler
  implements IQueryHandler<RetrieveItemByCodeQuery> {
  constructor(private readonly manager: ItemAggregateService) {}

  async execute(query: RetrieveItemByCodeQuery) {
    const { req, code } = query;
    return await this.manager.retrieveItemByCode(code, req);
  }
}
