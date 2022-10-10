import { IsNotEmpty, IsOptional } from 'class-validator';

export class SupplierDto {
  @IsOptional()
  uuid: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  company: string;
}
