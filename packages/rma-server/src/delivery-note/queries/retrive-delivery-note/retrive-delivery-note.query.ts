import { IQuery } from '@nestjs/cqrs';

export class RetriveDeliveryNoteQuery implements IQuery {
  constructor(public uuid: string) {}
}
