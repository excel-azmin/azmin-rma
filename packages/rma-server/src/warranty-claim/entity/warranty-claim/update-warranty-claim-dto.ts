import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { StatusHistory, WarrantyBulkProducts } from './warranty-claim.entity';

export class UpdateWarrantyClaimDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsOptional()
  @IsString()
  modifiedOn: Date;

  @IsOptional()
  @IsString()
  createdOn: Date;

  @IsOptional()
  @IsString()
  serialNo: string;

  @IsOptional()
  @IsString()
  claim_no: string;

  @IsOptional()
  @IsString()
  claim_type: string;

  @IsOptional()
  @IsString()
  received_date: Date;

  @IsOptional()
  @IsString()
  deliver_date: Date;

  @IsOptional()
  @IsString()
  customer_third_party: string;

  @IsOptional()
  @IsString()
  item_code: string;

  @IsOptional()
  @IsString()
  claimed_serial: string;

  @IsOptional()
  @IsString()
  invoice_no: string;

  @IsOptional()
  @IsString()
  service_charge: string;

  @IsOptional()
  @IsString()
  claim_status: string;

  @IsOptional()
  @IsString()
  warranty_status: string;

  @IsOptional()
  @IsString()
  receiving_branch: string;

  @IsOptional()
  @IsString()
  delivery_branch: string;

  @IsOptional()
  @IsString()
  received_by: string;

  @IsOptional()
  @IsString()
  delivered_by: string;

  @IsOptional()
  @IsString()
  customer: string;

  @IsOptional()
  @IsString()
  customer_contact: string;

  @IsOptional()
  @IsString()
  customer_address: string;

  @IsOptional()
  @IsString()
  serial_no: string;

  @IsOptional()
  @IsString()
  third_party_name: string;

  @IsOptional()
  @IsString()
  third_party_contact: string;

  @IsOptional()
  @IsString()
  third_party_address: string;

  @IsOptional()
  @IsString()
  warranty_claim_date: Date;

  @IsOptional()
  @IsString()
  warranty_end_date: Date;

  @IsOptional()
  @IsString()
  received_on: Date;

  @IsOptional()
  @IsString()
  delivery_date: Date;

  @IsOptional()
  @IsString()
  item_name: string;

  @IsOptional()
  @IsString()
  product_brand: string;

  @IsOptional()
  @IsString()
  problem: string;

  @IsOptional()
  @IsString()
  problem_details: string;

  @IsOptional()
  @IsString()
  remarks: string;

  @IsOptional()
  status_history: StatusHistory[];

  @IsOptional()
  posting_time: Date;

  @IsOptional()
  replace_serial: string;

  @IsOptional()
  replace_product: string;

  @IsOptional()
  replace_warehouse: string;

  @IsOptional()
  damaged_serial: string;

  @IsOptional()
  damage_warehouse: string;

  @IsOptional()
  damage_product: string;

  @IsOptional()
  billed_amount: string;

  @IsOptional()
  outstanding_amount: string;

  @IsOptional()
  print: any;

  @IsOptional()
  company: string;

  @IsOptional()
  category: string;

  @IsOptional()
  set: string;

  @IsOptional()
  bulk_products: WarrantyBulkProducts[];

  @IsOptional()
  parent: string;

  @IsOptional()
  service_vouchers: string[];

  @IsOptional()
  service_items: string[];

  @IsOptional()
  customer_code: string;

  @IsOptional()
  subclaim_state: string;
}
