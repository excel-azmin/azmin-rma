import { ICommand } from '@nestjs/cqrs';
import { CreateDeliveryNoteDto } from '../../entity/delivery-note-service/create-delivery-note.dto';
export class CreateDeliveryNoteCommand implements ICommand {
  constructor(public payload: CreateDeliveryNoteDto) {}
}
