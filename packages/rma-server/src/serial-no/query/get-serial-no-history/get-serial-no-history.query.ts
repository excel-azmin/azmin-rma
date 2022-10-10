import { IQuery } from '@nestjs/cqrs';

export class RetrieveSerialNoHistoryQuery implements IQuery {
  constructor(public readonly serial_no: string) {}
}
