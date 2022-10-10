import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
export class UpdateServiceInvoiceDto {
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  invoice_no: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsNumber()
  docstatus: string;

  @IsOptional()
  @IsNumber()
  is_pos: number;

  @IsOptional()
  @IsString()
  pos_profile: string;

  @IsOptional()
  payments: Payments[];
}

export class Payments {
  account: string;
  mode_of_payment: string;
  amount: number;
}
