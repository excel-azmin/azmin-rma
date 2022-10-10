import { IQuery } from '@nestjs/cqrs';

export class RetrieveSalesInvoiceDeliveredSerialNoQuery implements IQuery {
  constructor(
    public offset: number,
    public limit: number,
    public search: string,
    public find: string,
    public clientHttpRequest: any,
  ) {}
}
