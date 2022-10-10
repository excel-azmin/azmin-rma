import { IQuery } from '@nestjs/cqrs';

export class RetrieveSalesInvoiceListQuery implements IQuery {
  constructor(
    public offset: number,
    public limit: number,
    public sort: string,
    public filter_query: any,
    public req: any,
  ) {}
}
