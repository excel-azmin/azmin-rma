import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WarrantyBulkProducts } from '../../../warranty-claim/entity/warranty-claim/warranty-claim.entity';

export class Print {
  @IsString()
  print_type: string;
  t_warehouse: string;
  s_warehouse: string;
}

export class DeliveryChalanDto {
  @IsString()
  name: string;

  @IsString()
  customer_name: string;

  @ValidateNested()
  @Type(() => Print)
  print: Print;

  @IsString()
  company: string;

  @IsString()
  posting_date: string;

  @IsString()
  contact_email: string;

  @IsString()
  set_warehouse: string;

  @IsNumber()
  total_qty: number;

  @IsNumber()
  total: number;

  @IsString()
  in_words: string;

  @IsString()
  territory: string;

  @ValidateNested()
  @Type(() => DeliveryChalanItemDto)
  items: DeliveryChalanItemDto[];

  taxes?: any[];

  sales_team?: any[];

  address_display?: string;
  contact_mobile?: string;
  due_date?: string;
  sales_person?: string;
  created_by?: string;
  modified_by?: string;
  remarks?: string;
}

export class DeliveryChalanItemDto {
  @IsString()
  item_code: string;

  @IsString()
  item_name: string;

  description?: string;

  brand?: string;

  warehouse?: string;

  @IsString()
  against_sales_invoice: string;

  @IsOptional()
  @IsString()
  expense_account: string;

  @IsOptional()
  @IsString()
  excel_serials: string;

  @IsNumber()
  qty: number;

  @IsNumber()
  rate: number;

  @IsNumber()
  amount: number;
}

export interface WarrantyPrintDetails {
  name: string;
  third_party_name: string;
  third_party_contact: string;
  third_party_address: string;
  customer: string;
  customer_contact: string;
  customer_address: string;
  remarks: string;
  claim_no: string;
  received_on: string;
  delivery_date: string;
  receiving_branch: string;
  problem_details: string;
  delivered_by: string;
  received_by: string;
  items: string;
  s_warehouse: string;
  t_warehouse: string;
  tc_details: string;
  select_print_heading: string;
  warranty_invoices: string;
  footer: string;
  problem: string;
  uuid?: string;
  replace_serial: string;
  replace_product: string;
  replace_warehouse: string;
  claim_status?: string;
  status_history?: string;
  progress_state?: string;
  completed_delivery_note?: string;
  damage?: string;
  set?: string;
  service_vouchers?: string;
  damaged_serial?: string;
  damage_warehouse?: string;
  damage_product?: string;
  category?: string;
  service_items?: string;
  delivery_status?: string;
  bulk_products?: WarrantyBulkProducts[];
  print_type?: string;
  posting_time?: string;
}
