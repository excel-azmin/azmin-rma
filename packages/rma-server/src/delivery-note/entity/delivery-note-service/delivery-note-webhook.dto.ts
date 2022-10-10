import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeliveryNoteWebhookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  modified_by: string;

  @IsString()
  @IsOptional()
  contact_email: string;

  @IsNumber()
  @IsOptional()
  docstatus: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  naming_series: string;

  @IsString()
  @IsOptional()
  customer: string;

  @IsString()
  @IsOptional()
  customer_name: string;

  @IsString()
  @IsOptional()
  set_warehouse: string;

  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  posting_date: string;

  @IsString()
  @IsOptional()
  posting_time: string;

  @IsNumber()
  @IsOptional()
  is_return: boolean;

  @IsString()
  @IsOptional()
  currency: string;

  @IsNumber()
  @IsOptional()
  conversion_rate: number;

  @IsNumber()
  @IsOptional()
  total_qty: number;

  @IsNumber()
  @IsOptional()
  base_total: number;

  @IsNumber()
  @IsOptional()
  base_net_total: number;

  @IsNumber()
  @IsOptional()
  total: number;

  @IsNumber()
  @IsOptional()
  net_total: number;

  @IsNumber()
  @IsOptional()
  base_grand_total: number;

  @IsString()
  @IsOptional()
  customer_group: string;

  @IsString()
  @IsOptional()
  territory: string;

  @ValidateNested()
  @Type(() => DeliveryNoteItemsDto)
  items: DeliveryNoteItemsDto[];

  @ValidateNested()
  @Type(() => DeliveryNotePricingRulesDto)
  pricing_rules: DeliveryNotePricingRulesDto[];

  @ValidateNested()
  @Type(() => DeliveryNotePackedItemsDto)
  packed_items: DeliveryNotePackedItemsDto[];

  @ValidateNested()
  @Type(() => DeliveryNoteTaxesDto)
  taxes: DeliveryNoteTaxesDto[];

  @ValidateNested()
  @Type(() => DeliveryNoteSalesTeamDto)
  sales_team: DeliveryNoteSalesTeamDto[];
}
export class DeliveryNoteItemsDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  item_code: string;

  @IsString()
  @IsOptional()
  item_name: string;

  @IsNumber()
  @IsOptional()
  has_serial_no: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  serial_no: string;

  @IsNumber()
  @IsOptional()
  is_nil_exempt: number;

  @IsNumber()
  @IsOptional()
  is_non_gst: number;

  @IsString()
  @IsOptional()
  item_group: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  @IsOptional()
  qty: number;

  @IsNumber()
  @IsOptional()
  conversion_factor: number;

  @IsNumber()
  @IsOptional()
  stock_qty: number;

  @IsNumber()
  @IsOptional()
  price_list_rate: number;

  @IsNumber()
  @IsOptional()
  base_price_list_rate: number;

  @IsNumber()
  @IsOptional()
  rate: number;

  @IsNumber()
  @IsOptional()
  amount: number;
}
export class DeliveryNoteTaxesDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  docstatus: number;

  @IsString()
  @IsOptional()
  charge_type: string;

  @IsString()
  @IsOptional()
  account_head: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  cost_center: string;

  @IsNumber()
  @IsOptional()
  rate: number;

  @IsNumber()
  @IsOptional()
  tax_amount: number;

  @IsNumber()
  @IsOptional()
  total: number;
}
export class DeliveryNotePricingRulesDto {}
export class DeliveryNotePackedItemsDto {}
export class DeliveryNoteSalesTeamDto {}
