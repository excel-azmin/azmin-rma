import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class BinDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  warehouse: string;

  @IsNotEmpty()
  @IsString()
  item_code: string;

  @IsNotEmpty()
  @IsNumber()
  reserved_qty: number;

  @IsNotEmpty()
  @IsNumber()
  actual_qty: number;

  @IsNotEmpty()
  @IsNumber()
  ordered_qty: number;

  @IsNotEmpty()
  @IsNumber()
  indented_qty: number;

  @IsNotEmpty()
  @IsNumber()
  planned_qty: number;

  @IsNotEmpty()
  @IsNumber()
  projected_qty: number;

  @IsNotEmpty()
  @IsNumber()
  reserved_qty_for_production: number;

  @IsNotEmpty()
  @IsNumber()
  reserved_qty_for_sub_contract: number;

  @IsNotEmpty()
  @IsNumber()
  ma_rate: number;

  @IsNotEmpty()
  @IsString()
  stock_uom: string;

  @IsNotEmpty()
  @IsNumber()
  fcfs_rate: number;

  @IsNotEmpty()
  @IsNumber()
  valuation_rate: number;

  @IsNotEmpty()
  @IsNumber()
  stock_value: number;

  @IsNotEmpty()
  @IsString()
  doctype: string;

  @IsNotEmpty()
  @IsString()
  batch_no: string;

  @IsNotEmpty()
  @IsString()
  posting_date: string;

  @IsNotEmpty()
  @IsString()
  posting_time: string;

  @IsNotEmpty()
  @IsString()
  voucher_type: string;

  @IsNotEmpty()
  @IsString()
  voucher_no: string;

  @IsNotEmpty()
  @IsString()
  voucher_detail_no: string;

  @IsNotEmpty()
  @IsNumber()
  incoming_rate: number;

  @IsNotEmpty()
  @IsNumber()
  outgoing_rate: number;

  @IsNotEmpty()
  @IsNumber()
  qty_after_transaction: number;

  @IsNotEmpty()
  @IsNumber()
  stock_value_difference: number;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  fiscal_year: string;

  @IsNotEmpty()
  @IsString()
  is_cancelled: string;

  @IsNotEmpty()
  @IsNumber()
  to_rename: number;
}
