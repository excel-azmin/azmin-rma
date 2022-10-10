import { IQuery } from '@nestjs/cqrs';

export class RetrievePurchaseOrderQuery implements IQuery {
  constructor(public readonly params: unknown) {}
}
