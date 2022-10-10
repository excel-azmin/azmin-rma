import { IQuery } from '@nestjs/cqrs';

export class RetrieveSupplierQuery implements IQuery {
  constructor(public readonly uuid: string, public readonly req: any) {}
}
