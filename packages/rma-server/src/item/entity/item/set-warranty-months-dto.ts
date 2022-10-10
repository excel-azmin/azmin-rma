import { IsOptional, IsNumber } from 'class-validator';

export class SetWarrantyMonthsDto {
  @IsOptional()
  @IsNumber()
  purchaseWarrantyMonths: number;

  @IsOptional()
  @IsNumber()
  salesWarrantyMonths: number;
}
