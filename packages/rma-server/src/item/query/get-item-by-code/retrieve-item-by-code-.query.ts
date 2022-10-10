import { IQuery } from '@nestjs/cqrs';

export class RetrieveItemByCodeQuery implements IQuery {
  constructor(public readonly code: string, public readonly req: any) {}
}
