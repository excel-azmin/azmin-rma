import { IQuery } from '@nestjs/cqrs';

export class RetrieveWarrantyClaimQuery implements IQuery {
  constructor(public readonly uuid: string, public readonly req: any) {}
}
