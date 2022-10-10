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
import { ItemDto } from './sales-invoice-dto';

export class SalesInvoiceUpdateDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  delivery_warehouse: string;

  @IsOptional()
  @IsString()
  customer_name: string;

  @IsOptional()
  @IsString()
  customer: string;

  @IsOptional()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  posting_date: string;

  @IsOptional()
  @IsString()
  posting_time: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(SALES_INVOICE_STATUS_ENUM)
  status: string;

  @IsOptional()
  @IsNumber()
  set_posting_time: number;

  @IsOptional()
  @IsString()
  due_date: string;

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
  @IsString()
  contact_email: string;

  @IsOptional()
  @IsString()
  territory: string;

  @IsOptional()
  @IsNumber()
  update_stock: number;

  @IsOptional()
  @IsNumber()
  total_qty: number;

  @IsOptional()
  @IsNumber()
  base_total: number;

  @IsOptional()
  @IsNumber()
  base_net_total: number;

  @IsOptional()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsNumber()
  net_total: number;

  @IsOptional()
  @IsNumber()
  pos_total_qty: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ItemDto)
  items: ItemDto[];

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
  delivery_status: string;

  @IsOptional()
  is_pos: boolean;

  @IsOptional()
  @IsString()
  pos_profile: string;
}

export class TaxDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  charge_type: string;

  @IsOptional()
  @IsNumber()
  tax_amount: number;

  @IsOptional()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  account_head: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  rate: number;
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
