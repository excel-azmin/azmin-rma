import { IsNotEmpty } from 'class-validator';

export class UpdateSupplierDto {
  @IsNotEmpty()
  uuid: string;
}
