import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Item } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.entity';

export class ServiceInvoiceDto {
  @IsString()
  @IsNotEmpty()
  customer: string;

  @IsString()
  @IsOptional()
  customer_contact: string;

  @IsNumber()
  @IsNotEmpty()
  total_qty: number;

  @IsNumber()
  @IsOptional()
  total: number;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  contact_email: string;

  @IsString()
  @IsNotEmpty()
  due_date: string;

  @IsString()
  @IsOptional()
  remarks: string;

  @IsString()
  @IsOptional()
  delivery_warehouse: string;

  @IsNotEmpty()
  items: Item[];

  @IsString()
  @IsOptional()
  uuid: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  invoice_no: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  customer_third_party: string;

  @IsNumber()
  @IsOptional()
  invoice_amount: number;

  @IsString()
  @IsOptional()
  claim_no: string;

  @IsString()
  @IsOptional()
  branch: string;

  @IsString()
  @IsOptional()
  created_by: string;

  @IsString()
  @IsOptional()
  submitted_by: string;

  @IsString()
  @IsNotEmpty()
  posting_date: string;

  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsString()
  @IsOptional()
  customer_address: string;

  @IsString()
  @IsOptional()
  third_party_name: string;

  @IsString()
  @IsOptional()
  third_party_address: string;

  @IsString()
  @IsOptional()
  third_party_contact: string;

  @IsNumber()
  @IsNotEmpty()
  docstatus: number;

  @IsNumber()
  @IsOptional()
  outstanding_amount: number;

  @IsString()
  @IsNotEmpty()
  warrantyClaimUuid: string;

  @IsOptional()
  @IsString()
  debit_to: string;

  @IsOptional()
  @IsNumber()
  is_pos: number;

  @IsOptional()
  @IsNumber()
  set_posting_time: number;

  @IsOptional()
  @IsString()
  pos_profile: string;

  @IsOptional()
  @IsString()
  naming_series: string;

  @IsOptional()
  payments: Payments[];
}

export class Payments {
  account: string;
  mode_of_payment: string;
  amount: number;
}
