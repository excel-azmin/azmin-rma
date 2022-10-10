import { IsUUID, IsOptional } from 'class-validator';

export class UpdateCreditLimitDto {
  @IsUUID()
  uuid: string;

  @IsOptional()
  baseCreditLimitAmount: number;

  @IsOptional()
  tempCreditLimitPeriod: string;
}
