import { IsNotEmpty } from 'class-validator';

export class UpdateSerialNoDto {
  @IsNotEmpty()
  uuid: string;
}
