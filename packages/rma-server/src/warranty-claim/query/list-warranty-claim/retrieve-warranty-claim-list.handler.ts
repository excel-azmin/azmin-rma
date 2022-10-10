import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveWarrantyClaimListQuery } from './retrieve-warranty-claim-list.query';
import { WarrantyClaimAggregateService } from '../../aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';

@QueryHandler(RetrieveWarrantyClaimListQuery)
export class RetrieveWarrantyClaimListQueryHandler
  implements IQueryHandler<RetrieveWarrantyClaimListQuery> {
  constructor(private readonly manager: WarrantyClaimAggregateService) {}
  async execute(query: RetrieveWarrantyClaimListQuery) {
    const { offset, limit, sort, filter_query, territory, req } = query;
    return await this.manager.getWarrantyClaimList(
      Number(offset),
      Number(limit),
      sort,
      filter_query,
      territory,
      req,
    );
  }
}
