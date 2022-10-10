import { IQuery } from '@nestjs/cqrs';

export class RetrieveCustomerQuery implements IQuery {
  constructor(public readonly name: string, public readonly req: any) {}
}
