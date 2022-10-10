import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrievePurchaseInvoiceQuery } from './retrieve-purchase-invoice.query';
import { PurchaseInvoiceAggregateService } from '../../aggregates/purchase-invoice-aggregate/purchase-invoice-aggregate.service';

@QueryHandler(RetrievePurchaseInvoiceQuery)
export class RetrievePurchaseInvoiceQueryHandler
  implements IQueryHandler<RetrievePurchaseInvoiceQuery> {
  constructor(private readonly manager: PurchaseInvoiceAggregateService) {}

  async execute(query: RetrievePurchaseInvoiceQuery) {
    const { req, uuid } = query;
    return this.manager.retrievePurchaseInvoice(uuid, req);
  }
}
