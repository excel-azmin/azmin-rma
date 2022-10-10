import { STOCK_ENTRY } from '../../constants/app-strings';
import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WarrantyStockEntryDto {
  docstatus?: 1;
  uuid?: string;
  naming_series?: string;
  action?: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  warrantyClaimUuid: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  stock_entry_type: string;

  @IsOptional()
  @IsString()
  stock_voucher_number: string;

  @IsOptional()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  remarks: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  posting_date: string;

  @IsOptional()
  @IsString()
  remark: string;

  @IsOptional()
  @IsString()
  territory: string;

  @IsOptional()
  @IsString()
  posting_time: string;

  @IsNotEmpty()
  @IsString()
  doctype: string = STOCK_ENTRY;

  @IsOptional()
  @IsString()
  customer: string;

  @IsOptional()
  @IsString()
  salesWarrantyDate: string;

  @IsOptional()
  @IsString()
  soldOn: string;

  @IsOptional()
  @IsString()
  delivery_note: string;

  @IsOptional()
  @IsString()
  sales_invoice_name: string;

  @IsOptional()
  @IsString()
  set_warehouse: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WarrantyStockEntryItemDto)
  items: WarrantyStockEntryItemDto[];
}

export class WarrantyStockEntryItemDto {
  @IsOptional()
  @IsString()
  s_warehouse: string;

  @IsOptional()
  @IsString()
  t_warehouse: string;

  @IsOptional()
  @IsString()
  transferWarehouse: string;

  @IsNotEmpty()
  @IsString()
  item_code: string;

  @IsOptional()
  @IsNumber()
  has_serial_no: number;

  @IsNotEmpty()
  @IsString()
  item_name: string;

  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @IsOptional()
  @IsString()
  serial_no: any;

  @IsOptional()
  @IsString()
  warehouse: string;

  @IsOptional()
  @IsString()
  stock_entry_type: string;
  excel_serials: any;
}
