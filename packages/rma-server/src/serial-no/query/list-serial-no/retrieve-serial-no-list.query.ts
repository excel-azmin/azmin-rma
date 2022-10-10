import { IQuery } from '@nestjs/cqrs';

export class RetrieveSerialNoListQuery implements IQuery {
  constructor(
    public offset: number,
    public limit: number,
    public sort: string,
    public query: string,
  ) {}
}
