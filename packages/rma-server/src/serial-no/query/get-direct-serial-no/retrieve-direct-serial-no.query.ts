import { IQuery } from '@nestjs/cqrs';

export class RetrieveDirectSerialNoQuery implements IQuery {
  constructor(public readonly serial_no: string) {}
}
