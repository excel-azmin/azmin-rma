import { IQuery } from '@nestjs/cqrs';

export class RetrievePurchaseInvoiceListQuery implements IQuery {
  constructor(
    public offset: number,
    public limit: number,
    public sort: string,
    public filter_query: any,
  ) {}
}
