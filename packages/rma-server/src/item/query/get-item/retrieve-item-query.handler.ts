import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveItemQuery } from './retrieve-item.query';
import { ItemAggregateService } from '../../aggregates/item-aggregate/item-aggregate.service';

@QueryHandler(RetrieveItemQuery)
export class RetrieveItemHandler implements IQueryHandler<RetrieveItemQuery> {
  constructor(private readonly manager: ItemAggregateService) {}

  async execute(query: RetrieveItemQuery) {
    const { req, uuid } = query;
    return this.manager.retrieveItem(uuid, req);
  }
}
