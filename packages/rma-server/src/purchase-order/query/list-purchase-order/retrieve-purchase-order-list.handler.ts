import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrievePurchaseOrderListQuery } from './retrieve-purchase-order-list.query';
import { PurchaseOrderAggregateService } from '../../aggregates/purchase-order-aggregate/purchase-order-aggregate.service';

@QueryHandler(RetrievePurchaseOrderListQuery)
export class RetrievePurchaseOrderListQueryHandler
  implements IQueryHandler<RetrievePurchaseOrderListQuery> {
  constructor(private readonly manager: PurchaseOrderAggregateService) {}
  async execute(query: RetrievePurchaseOrderListQuery) {
    const { offset, limit, sort, filter_query } = query;
    return await this.manager.getPurchaseOrderList(
      Number(offset),
      Number(limit),
      sort,
      filter_query,
    );
  }
}
