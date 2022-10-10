import { IQuery } from '@nestjs/cqrs';

export class RetrieveSerialNoQuery implements IQuery {
  constructor(public readonly serial_no: string) {}
}
