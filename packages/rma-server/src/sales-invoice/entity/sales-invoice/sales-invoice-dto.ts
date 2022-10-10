import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SALES_INVOICE_STATUS_ENUM } from '../../../constants/app-strings';

export class SalesInvoiceDto {
  @IsNotEmpty()
  @IsString()
  customer: string;

  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  posting_date: string;

  @IsNotEmpty()
  @IsString()
  posting_time: string;

  @IsNotEmpty()
  @IsString()
  due_date: string;

  @IsNotEmpty()
  @IsString()
  contact_email: string;

  @IsNotEmpty()
  @IsString()
  territory: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(SALES_INVOICE_STATUS_ENUM)
  status: string;

  @IsNotEmpty()
  @IsNumber()
  update_stock: number;

  @IsNotEmpty()
  @IsNumber()
  total_qty: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsNotEmpty()
  @IsString()
  delivery_warehouse: string;

  @IsOptional()
  @IsNumber()
  set_posting_time: number;

  @IsOptional()
  @IsString()
  address_display: string;

  @IsOptional()
  @IsString()
  contact_person: string;

  @IsOptional()
  @IsString()
  contact_display: string;

  @IsOptional()
  @IsNumber()
  base_total: number;

  @IsOptional()
  @IsNumber()
  base_net_total: number;

  @IsOptional()
  @IsNumber()
  net_total: number;

  @IsOptional()
  @IsNumber()
  pos_total_qty: number;

  @IsOptional()
  pricing_rules: any[];

  @IsOptional()
  packed_items: any[];

  @IsOptional()
  timesheets: any[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TaxDto)
  taxes: TaxDto[];

  @IsOptional()
  advances: any[];

  @IsOptional()
  payment_schedule: any[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentsDto)
  payments: PaymentsDto[];

  @IsOptional()
  sales_team: any[];

  @IsOptional()
  isCampaign: boolean;

  @IsOptional()
  remarks: string;

  @IsOptional()
  @IsString()
  delivery_status: string;

  @IsOptional()
  is_pos: boolean;

  @IsOptional()
  @IsString()
  pos_profile: string;
}

export class TaxDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  charge_type: string;

  @IsNotEmpty()
  @IsNumber()
  tax_amount: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsString()
  account_head: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  rate: number;
}

export class ItemDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsNotEmpty()
  @IsString()
  item_code: string;

  @IsNotEmpty()
  @IsString()
  item_name: string;

  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @IsNotEmpty()
  @IsBoolean()
  has_bundle_item?: boolean;

  @IsOptional()
  @IsNumber()
  is_stock_item?: number;

  @IsNotEmpty()
  @IsNumber()
  has_serial_no?: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  excel_serials: string;
}

export class PaymentsDto {
  @IsNotEmpty()
  @IsString()
  mode_of_payment: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsBoolean()
  default?: boolean;

  @IsNotEmpty()
  @IsString()
  account: string;
}

export class MRPRateUpdateInterface {
  name: string;
  item_code: string;
  qty: number;
  mrp_sales_rate?: number;
  mrp_sales_amount?: number;
}
