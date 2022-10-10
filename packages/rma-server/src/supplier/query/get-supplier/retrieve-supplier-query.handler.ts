import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveSupplierQuery } from './retrieve-supplier.query';
import { SupplierAggregateService } from '../../aggregates/supplier-aggregate/supplier-aggregate.service';

@QueryHandler(RetrieveSupplierQuery)
export class RetrieveSupplierHandler
  implements IQueryHandler<RetrieveSupplierQuery> {
  constructor(
    private readonly supplierAggregateService: SupplierAggregateService,
  ) {}

  async execute(query: RetrieveSupplierQuery) {
    const { req, uuid } = query;
    return this.supplierAggregateService.retrieveSupplier(uuid, req);
  }
}
