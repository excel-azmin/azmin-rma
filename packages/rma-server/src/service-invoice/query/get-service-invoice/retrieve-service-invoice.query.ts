import { IQuery } from '@nestjs/cqrs';

export class RetrieveServiceInvoiceQuery implements IQuery {
  constructor(public readonly uuid: string, public readonly req: any) {}
}
