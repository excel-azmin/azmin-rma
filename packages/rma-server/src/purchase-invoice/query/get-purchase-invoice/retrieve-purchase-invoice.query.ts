import { IQuery } from '@nestjs/cqrs';

export class RetrievePurchaseInvoiceQuery implements IQuery {
  constructor(public readonly uuid: string, public readonly req: any) {}
}
