import { IQuery } from '@nestjs/cqrs';

export class RetrieveItemQuery implements IQuery {
  constructor(public readonly uuid: string, public readonly req: any) {}
}
