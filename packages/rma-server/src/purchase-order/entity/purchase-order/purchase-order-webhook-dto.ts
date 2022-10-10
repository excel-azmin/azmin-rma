import { IsOptional, ValidateNested } from 'class-validator';
import { PaymentSchedule } from './po-payment-schedule.interface';
import { PurchaseOrderItem } from './purchase-order-item.interface';
import { Type } from 'class-transformer';

export class PurchaseOrderWebhookDto {
  @IsOptional()
  name: string;
  @IsOptional()
  owner: string;
  @IsOptional()
  creation: string;
  @IsOptional()
  modified: string;
  @IsOptional()
  modified_by: string;
  @IsOptional()
  idx: number;
  @IsOptional()
  docstatus: number;
  @IsOptional()
  title: string;
  @IsOptional()
  naming_series: string;
  @IsOptional()
  supplier: string;
  @IsOptional()
  supplier_name: string;
  @IsOptional()
  company: string;
  @IsOptional()
  transaction_date: string;
  @IsOptional()
  schedule_date: string;
  @IsOptional()
  supplier_address: string;
  @IsOptional()
  address_display: string;
  @IsOptional()
  currency: string;
  @IsOptional()
  conversion_rate: number;
  @IsOptional()
  buying_price_list: string;
  @IsOptional()
  price_list_currency: string;
  @IsOptional()
  plc_conversion_rate: number;
  @IsOptional()
  ignore_pricing_rule: number;
  @IsOptional()
  is_subcontracted: string;
  @IsOptional()
  total_qty: number;
  @IsOptional()
  base_total: number;
  @IsOptional()
  base_net_total: number;
  @IsOptional()
  total: number;
  @IsOptional()
  net_total: number;
  @IsOptional()
  total_net_weight: number;
  @IsOptional()
  base_taxes_and_charges_added: number;
  @IsOptional()
  base_taxes_and_charges_deducted: number;
  @IsOptional()
  base_total_taxes_and_charges: number;
  @IsOptional()
  taxes_and_charges_added: number;
  @IsOptional()
  taxes_and_charges_deducted: number;
  @IsOptional()
  total_taxes_and_charges: number;
  @IsOptional()
  apply_discount_on: string;
  @IsOptional()
  base_discount_amount: number;
  @IsOptional()
  additional_discount_percentage: number;
  @IsOptional()
  discount_amount: number;
  @IsOptional()
  base_grand_total: number;
  @IsOptional()
  base_rounding_adjustment: number;
  @IsOptional()
  base_in_words: string;
  @IsOptional()
  base_rounded_total: number;
  @IsOptional()
  grand_total: number;
  @IsOptional()
  rounding_adjustment: number;
  @IsOptional()
  rounded_total: number;
  @IsOptional()
  disable_rounded_total: number;
  @IsOptional()
  in_words: string;
  @IsOptional()
  advance_paid: number;
  @IsOptional()
  terms: string;
  @IsOptional()
  status: string;
  @IsOptional()
  party_account_currency: string;
  @IsOptional()
  per_received: number;
  @IsOptional()
  per_billed: number;
  @IsOptional()
  group_same_items: number;
  @IsOptional()
  language: string;
  @IsOptional()
  doctype: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];
  @IsOptional()
  pricing_rules: any[];
  @IsOptional()
  supplied_items: any[];
  @IsOptional()
  taxes: any[];
  @IsOptional()
  @ValidateNested()
  @Type(() => PurchaseOrderPaymentScheduleDto)
  payment_schedule: PurchaseOrderPaymentScheduleDto[];
  @IsOptional()
  isSynced: boolean;
  @IsOptional()
  inQueue: boolean;
  @IsOptional()
  submitted: boolean;
  @IsOptional()
  created_on: Date;
  @IsOptional()
  created_by: string;
}

export class PurchaseOrderPaymentScheduleDto implements PaymentSchedule {
  @IsOptional()
  name: string;
  @IsOptional()
  owner: string;
  @IsOptional()
  creation: string;
  @IsOptional()
  modified: string;
  @IsOptional()
  modified_by: string;
  @IsOptional()
  parent: string;
  @IsOptional()
  parentfield: string;
  @IsOptional()
  parenttype: string;
  @IsOptional()
  idx: number;
  @IsOptional()
  docstatus: number;
  @IsOptional()
  due_date: string;
  @IsOptional()
  invoice_portion: number;
  @IsOptional()
  payment_amount: number;
  @IsOptional()
  doctype: string;
}

export class PurchaseOrderItemDto implements PurchaseOrderItem {
  @IsOptional()
  name: string;
  @IsOptional()
  owner: string;
  @IsOptional()
  creation: string;
  @IsOptional()
  modified: string;
  @IsOptional()
  modified_by: string;
  @IsOptional()
  parent: string;
  @IsOptional()
  parentfield: string;
  @IsOptional()
  parenttype: string;
  @IsOptional()
  idx: number;
  @IsOptional()
  docstatus: number;
  @IsOptional()
  item_code: string;
  @IsOptional()
  item_name: string;
  @IsOptional()
  schedule_date: string;
  @IsOptional()
  description: string;
  @IsOptional()
  is_nil_exempt: number;
  @IsOptional()
  is_non_gst: number;
  @IsOptional()
  image: string;
  @IsOptional()
  qty: number;
  @IsOptional()
  stock_uom: string;
  @IsOptional()
  uom: string;
  @IsOptional()
  conversion_factor: number;
  @IsOptional()
  price_list_rate: number;
  @IsOptional()
  discount_percentage: number;
  @IsOptional()
  discount_amount: number;
  @IsOptional()
  last_purchase_rate: number;
  @IsOptional()
  base_price_list_rate: number;
  @IsOptional()
  rate: number;
  @IsOptional()
  amount: number;
  @IsOptional()
  base_rate: number;
  @IsOptional()
  base_amount: number;
  @IsOptional()
  is_free_item: number;
  @IsOptional()
  is_fixed_asset: number;
  @IsOptional()
  net_rate: number;
  @IsOptional()
  net_amount: number;
  @IsOptional()
  base_net_rate: number;
  @IsOptional()
  base_net_amount: number;
  @IsOptional()
  billed_amt: number;
  @IsOptional()
  weight_per_unit: number;
  @IsOptional()
  total_weight: number;
  @IsOptional()
  warehouse: string;
  @IsOptional()
  delivered_by_supplier: number;
  @IsOptional()
  against_blanket_order: number;
  @IsOptional()
  blanket_order_rate: number;
  @IsOptional()
  item_group: string;
  @IsOptional()
  include_exploded_items: number;
  @IsOptional()
  stock_qty: number;
  @IsOptional()
  received_qty: number;
  @IsOptional()
  returned_qty: number;
  @IsOptional()
  page_break: number;
  @IsOptional()
  item_tax_rate: string;
  @IsOptional()
  doctype: string;
}
