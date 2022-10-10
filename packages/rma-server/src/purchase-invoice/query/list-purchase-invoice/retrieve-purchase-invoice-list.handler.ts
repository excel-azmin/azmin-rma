import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrievePurchaseInvoiceListQuery } from './retrieve-purchase-invoice-list.query';
import { PurchaseInvoiceAggregateService } from '../../aggregates/purchase-invoice-aggregate/purchase-invoice-aggregate.service';

@QueryHandler(RetrievePurchaseInvoiceListQuery)
export class RetrievePurchaseInvoiceListQueryHandler
  implements IQueryHandler<RetrievePurchaseInvoiceListQuery> {
  constructor(private readonly manager: PurchaseInvoiceAggregateService) {}
  async execute(query: RetrievePurchaseInvoiceListQuery) {
    const { offset, limit, sort, filter_query } = query;
    return await this.manager.getPurchaseInvoiceList(
      Number(offset) || 0,
      Number(limit) || 10,
      sort,
      filter_query,
    );
  }
}
