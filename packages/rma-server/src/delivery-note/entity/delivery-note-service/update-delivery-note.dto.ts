import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDeliveryNoteDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsOptional()
  @IsString()
  sales_invoice_name: string;

  @IsOptional()
  @IsString()
  set_warehouse: string;

  @IsOptional()
  @IsNumber()
  total_qty: number;

  @IsOptional()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  posting_date: string;

  @IsOptional()
  @IsString()
  posting_time: string;

  @IsOptional()
  @IsString()
  customer: string;

  @IsOptional()
  @IsString()
  company: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DeliveryNoteItemDto)
  items: DeliveryNoteItemDto[];
}

export class DeliveryNoteItemDto {
  @IsOptional()
  @IsString()
  item_code: string;

  @IsOptional()
  @IsNumber()
  qty: number;

  @IsOptional()
  @IsNumber()
  rate: number;

  @IsOptional()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  serial_no: string;
}
