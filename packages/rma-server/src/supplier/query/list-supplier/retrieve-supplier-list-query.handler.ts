import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveSupplierListQuery } from './retrieve-supplier-list.query';
import { SupplierAggregateService } from '../../aggregates/supplier-aggregate/supplier-aggregate.service';

@QueryHandler(RetrieveSupplierListQuery)
export class RetrieveSupplierListHandler
  implements IQueryHandler<RetrieveSupplierListQuery> {
  constructor(
    private readonly supplierAggregateService: SupplierAggregateService,
  ) {}
  async execute(query: RetrieveSupplierListQuery) {
    const { offset, limit, search, sort, clientHttpRequest } = query;
    return await this.supplierAggregateService.getSupplierList(
      Number(offset),
      Number(limit),
      search,
      sort,
      clientHttpRequest,
    );
  }
}
