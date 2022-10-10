import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseReceiptItemDto {
  @IsNotEmpty()
  @IsString()
  item_code: string;

  @IsNotEmpty()
  @IsString()
  item_name: string;

  @IsNotEmpty()
  @IsString()
  warehouse: string;

  @IsOptional()
  @IsString()
  warranty_date: string;

  purchase_order?: string;
  base_total: number;

  uom: string;
  stock_uom: string;
  conversion_factor: number;
  description?: string;

  @IsOptional()
  @IsNumber()
  has_serial_no: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  serial_no: any;

  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class PurchaseReceiptDto {
  @IsNotEmpty()
  @IsString()
  purchase_invoice_name: string;

  @IsNotEmpty()
  @IsString()
  naming_series: string;

  @IsNotEmpty()
  @IsString()
  supplier: string;

  @IsNotEmpty()
  @IsString()
  posting_date: string;

  @IsNotEmpty()
  @IsString()
  posting_time: string;

  set_posting_time?: number;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsNumber()
  total_qty: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => PurchaseReceiptItemDto)
  items: PurchaseReceiptItemDto[];

  docstatus?: number;
  is_return?: number;
  currency: string;
  selling_price_list: string;
  conversion_rate: number;
  status: string;
}
