import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { VERDICT } from '../../../constants/app-strings';

export class StatusHistoryDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  posting_date: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsString()
  status_from: string;

  @IsOptional()
  @IsString()
  transfer_branch: string;

  @IsNotEmpty()
  @IsEnum(VERDICT)
  verdict: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  delivery_status: string;

  @IsOptional()
  @IsString()
  delivery_branch: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  claim_status: string;

  @IsOptional()
  @IsString()
  doc_name: string;

  @IsOptional()
  @IsString()
  created_by: string;
}
