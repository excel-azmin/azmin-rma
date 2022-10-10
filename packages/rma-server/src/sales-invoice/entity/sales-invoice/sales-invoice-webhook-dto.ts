import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SalesInvoiceWebhookDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  is_return: boolean;

  @IsOptional()
  issue_credit_note: boolean;

  @IsNotEmpty()
  @IsString()
  title: string;

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
  @IsNumber()
  set_posting_time: number;

  @IsNotEmpty()
  @IsString()
  due_date: string;

  @IsOptional()
  address_display: string;

  @IsOptional()
  contact_person: string;

  @IsOptional()
  contact_display: string;

  @IsOptional()
  contact_email: string;

  @IsNotEmpty()
  @IsString()
  territory: string;

  @IsNotEmpty()
  @IsNumber()
  update_stock: number;

  @IsNotEmpty()
  @IsNumber()
  total_qty: number;

  @IsNotEmpty()
  @IsNumber()
  base_total: number;

  @IsNotEmpty()
  @IsNumber()
  base_net_total: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsNumber()
  net_total: number;

  @IsNotEmpty()
  @IsNumber()
  outstanding_amount: number;

  @IsNotEmpty()
  @IsNumber()
  pos_total_qty: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SalesInvoiceWebhookItemDto)
  items: SalesInvoiceWebhookItemDto[];

  @IsOptional()
  pricing_rules: any[];

  @IsOptional()
  packed_items: any[];

  @IsOptional()
  timesheets: any[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SalesInvoiceWebhookTaxDto)
  taxes: SalesInvoiceWebhookTaxDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SalesInvoiceAdvancesDto)
  advances: SalesInvoiceAdvancesDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => SalesInvoicePaymentScheduleDto)
  payment_schedule: SalesInvoicePaymentScheduleDto[];

  @IsOptional()
  payments: any[];

  @IsOptional()
  sales_team: any[];

  @IsOptional()
  remarks: string;
}

export class SalesInvoiceWebhookTaxDto {
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

export class SalesInvoiceWebhookItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  item_code: string;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  item_name: string;

  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @IsNumber()
  @IsNotEmpty()
  rate: number;

  @IsNumber()
  @IsOptional()
  has_serial_no?: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsOptional()
  @IsString()
  excel_serials: string;
}

export class SalesInvoicePaymentScheduleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  due_date: string;

  @IsNotEmpty()
  @IsNumber()
  invoice_portion: number;

  @IsNotEmpty()
  @IsNumber()
  payment_amount: number;
}

export class SalesInvoiceAdvancesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  parenttype: string;

  @IsNotEmpty()
  @IsString()
  reference_type: string;

  @IsNotEmpty()
  @IsString()
  reference_name: string;

  @IsNotEmpty()
  @IsString()
  reference_row: string;

  @IsNumber()
  @IsNotEmpty()
  advance_amount: number;

  @IsNumber()
  @IsNotEmpty()
  allocated_amount: number;
}
