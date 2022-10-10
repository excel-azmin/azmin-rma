import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ItemAggregateService } from '../../aggregates/item-aggregate/item-aggregate.service';
import { RetrieveItemListQuery } from './retrieve-item-list.query';

@QueryHandler(RetrieveItemListQuery)
export class RetrieveItemListHandler
  implements IQueryHandler<RetrieveItemListQuery> {
  constructor(private readonly manager: ItemAggregateService) {}
  async execute(query: RetrieveItemListQuery) {
    const { offset, limit, search, sort, clientHttpRequest } = query;
    return await this.manager.getItemList(
      Number(offset),
      Number(limit),
      search,
      sort,
      clientHttpRequest,
    );
  }
}
