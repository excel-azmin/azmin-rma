import { IQuery } from '@nestjs/cqrs';

export class RetrieveSalesInvoiceReturnedSerialNoQuery implements IQuery {
  constructor(
    public salesInvoiceName: string,
    public offset: number,
    public limit: number,
  ) {}
}
