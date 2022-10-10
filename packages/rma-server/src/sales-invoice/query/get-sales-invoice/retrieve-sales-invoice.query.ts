import { IQuery } from '@nestjs/cqrs';

export class RetrieveSalesInvoiceQuery implements IQuery {
  constructor(public readonly uuid: string, public readonly req: any) {}
}
