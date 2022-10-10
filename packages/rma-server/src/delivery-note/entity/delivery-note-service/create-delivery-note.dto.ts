import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDeliveryNoteDto {
  @IsNotEmpty()
  @IsString()
  sales_invoice_name: string;

  @IsNotEmpty()
  @IsString()
  set_warehouse: string;

  @IsNotEmpty()
  @IsNumber()
  total_qty: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsString()
  posting_date: string;

  @IsNotEmpty()
  @IsString()
  posting_time: string;

  @IsNotEmpty()
  @IsString()
  customer: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DeliveryNoteItemDto)
  items: DeliveryNoteItemDto[];
}

export class DeliveryNoteItemDto {
  @IsNotEmpty()
  @IsString()
  item_code: string;

  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsArray()
  serial_no: string[];
}
