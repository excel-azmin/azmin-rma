import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveSerialNoListQuery } from './retrieve-serial-no-list.query';
import { SerialNoAggregateService } from '../../aggregates/serial-no-aggregate/serial-no-aggregate.service';

@QueryHandler(RetrieveSerialNoListQuery)
export class RetrieveSerialNoListHandler
  implements IQueryHandler<RetrieveSerialNoListQuery> {
  constructor(private readonly manager: SerialNoAggregateService) {}
  async execute(query: RetrieveSerialNoListQuery) {
    const { offset, limit, sort, query: filterQuery } = query;
    return await this.manager.getSerialNoList(
      Number(offset),
      Number(limit),
      sort,
      filterQuery,
    );
  }
}
