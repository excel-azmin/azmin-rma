import { IQuery } from '@nestjs/cqrs';

export class RetrievePurchaseOrderListQuery implements IQuery {
  constructor(
    public offset: number,
    public limit: number,
    public sort: string,
    public filter_query: any,
  ) {}
}
