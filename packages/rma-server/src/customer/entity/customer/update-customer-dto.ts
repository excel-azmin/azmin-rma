import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCustomerDto {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}
