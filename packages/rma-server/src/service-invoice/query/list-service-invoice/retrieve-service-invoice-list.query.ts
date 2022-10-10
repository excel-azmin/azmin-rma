import { IQuery } from '@nestjs/cqrs';

export class RetrieveServiceInvoiceListQuery implements IQuery {
  constructor(
    public offset: number,
    public limit: number,
    public search: string,
    public sort: string,
    public clientHttpRequest: any,
  ) {}
}
