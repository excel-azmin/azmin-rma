import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class SerialNoDto {
  @IsNotEmpty()
  @IsString()
  supplier: string;

  @IsNotEmpty()
  @IsString()
  item_code: string;

  @IsNotEmpty()
  @IsString()
  serial_no: string;

  @IsNotEmpty()
  @IsString()
  claim_no: string;

  @IsNotEmpty()
  @IsString()
  claim_type: string;

  @IsNotEmpty()
  @IsString()
  customer_third_party: string;

  @IsNotEmpty()
  @IsString()
  claimed_serial: string;

  @IsNotEmpty()
  @IsString()
  invoice_no: string;

  @IsNotEmpty()
  @IsString()
  service_charge: string;

  @IsNotEmpty()
  @IsString()
  claim_status: string;

  @IsNotEmpty()
  @IsString()
  warranty_status: string;

  @IsNotEmpty()
  @IsString()
  receiving_branch: string;

  @IsNotEmpty()
  @IsString()
  delivery_branch: string;

  @IsNotEmpty()
  @IsString()
  received_by: string;

  @IsNotEmpty()
  @IsString()
  delivered_by: string;

  @IsNotEmpty()
  @IsString()
  received_date: Date;

  @IsNotEmpty()
  @IsString()
  deliver_date: Date;

  @IsOptional()
  @IsString()
  brand: string;
}

export class ValidateSerialsDto {
  @IsOptional()
  @IsArray()
  serials: string[];

  @IsOptional()
  @IsString()
  item_code: string;

  @IsOptional()
  @IsString()
  validateFor: string;

  @IsOptional()
  @IsString()
  warehouse: string;
}

export class ValidateReturnSerialsDto {
  @IsOptional()
  @IsArray()
  serials: string[];

  @IsOptional()
  @IsString()
  item_code: string;

  @IsOptional()
  @IsArray()
  delivery_note_names: string[];

  @IsOptional()
  @IsString()
  warehouse: string;
}
