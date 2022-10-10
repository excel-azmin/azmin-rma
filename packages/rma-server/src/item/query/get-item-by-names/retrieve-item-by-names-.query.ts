import { IQuery } from '@nestjs/cqrs';

export class RetrieveItemByNamesQuery implements IQuery {
  constructor(public readonly items: string[], public readonly req: any) {}
}
