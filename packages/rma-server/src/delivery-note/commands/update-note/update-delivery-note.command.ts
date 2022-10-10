import { ICommand } from '@nestjs/cqrs';
import { UpdateDeliveryNoteDto } from '../../entity/delivery-note-service/update-delivery-note.dto';

export class UpdateDeliveryNoteCommand implements ICommand {
  constructor(public payload: UpdateDeliveryNoteDto) {}
}
