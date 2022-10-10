import { ICommand } from '@nestjs/cqrs';
import { AssignSerialDto } from '../../entity/serial-no/assign-serial-dto';

export class AssignSerialNoCommand implements ICommand {
  constructor(
    public readonly assignPayload: AssignSerialDto,
    public readonly clientHttpRequest: any,
  ) {}
}
