import { IEvent } from '@nestjs/cqrs';

export class DeliveryNoteDeletedEvent implements IEvent {
  constructor(public readonly uuid: string) {}
}
