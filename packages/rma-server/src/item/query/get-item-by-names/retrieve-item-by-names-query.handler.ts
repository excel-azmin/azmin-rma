import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ItemAggregateService } from '../../aggregates/item-aggregate/item-aggregate.service';
import { RetrieveItemByNamesQuery } from './retrieve-item-by-names-.query';

@QueryHandler(RetrieveItemByNamesQuery)
export class RetrieveItemByNamesHandler
  implements IQueryHandler<RetrieveItemByNamesQuery> {
  constructor(private readonly manager: ItemAggregateService) {}

  async execute(query: RetrieveItemByNamesQuery) {
    const { req, items } = query;
    return await this.manager.retrieveItemByNames(items, req);
  }
}
