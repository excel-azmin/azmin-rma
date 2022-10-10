import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseInvoiceWebhookDto {
  @IsNotEmpty()
  @IsNumber()
  docstatus: number;

  @IsOptional()
  @IsNumber()
  is_paid: number;

  @IsNotEmpty()
  @IsNumber()
  is_return: number;

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
  total: number;

  @IsOptional()
  @IsNumber()
  total_advance: number;

  @IsNotEmpty()
  @IsNumber()
  outstanding_amount: number;

  @IsOptional()
  @IsNumber()
  paid_amount: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  owner: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  supplier: string;

  @IsOptional()
  @IsString()
  supplier_name: string;

  @IsNotEmpty()
  @IsString()
  naming_series: string;

  @IsNotEmpty()
  @IsString()
  due_date: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  posting_date: string;

  @IsNotEmpty()
  @IsString()
  posting_time: string;

  @IsOptional()
  @IsString()
  supplier_address: string;

  @IsOptional()
  @IsString()
  address_display: string;

  @IsOptional()
  @IsString()
  buying_price_list: string;

  @IsOptional()
  @IsString()
  in_words: string;

  @IsOptional()
  @IsString()
  credit_to: string;

  @IsOptional()
  @IsString()
  against_expense_account: string;

  @IsOptional()
  pricing_rules: any[];

  @IsOptional()
  supplied_items: any[];

  @IsOptional()
  taxes: any[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PurchaseInvoiceItemDto)
  items: PurchaseInvoiceItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PurchaseInvoiceAdvancesDto)
  advances: PurchaseInvoiceAdvancesDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PurchaseInvoicePaymentScheduleDto)
  payment_schedule: PurchaseInvoicePaymentScheduleDto[];
}

export class PurchaseInvoicePaymentScheduleDto {
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

export class PurchaseInvoiceAdvancesDto {
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

  @IsOptional()
  @IsString()
  reference_row: string;

  @IsNumber()
  @IsNotEmpty()
  advance_amount: number;

  @IsNumber()
  @IsNotEmpty()
  allocated_amount: number;
}

export class PurchaseInvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  item_code: string;

  @IsString()
  @IsNotEmpty()
  item_name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  item_group: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsNotEmpty()
  warehouse: string;

  @IsString()
  @IsOptional()
  serial_no: string;

  @IsString()
  @IsNotEmpty()
  expense_account: string;

  @IsString()
  @IsNotEmpty()
  cost_center: string;

  @IsNumber()
  @IsOptional()
  received_qty: number;

  @IsNumber()
  @IsOptional()
  has_serial_no: number;

  @IsNumber()
  @IsNotEmpty()
  qty: number;

  @IsNumber()
  @IsOptional()
  rejected_qty: number;

  @IsNumber()
  @IsNotEmpty()
  rate: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
