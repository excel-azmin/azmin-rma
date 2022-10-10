import { IQuery } from '@nestjs/cqrs';
import { ValidateSerialsDto } from '../../entity/serial-no/serial-no-dto';

export class ValidateSerialsQuery implements IQuery {
  constructor(
    public readonly payload: ValidateSerialsDto,
    public readonly clientHttpReq: any,
    public readonly file: any,
  ) {}
}
