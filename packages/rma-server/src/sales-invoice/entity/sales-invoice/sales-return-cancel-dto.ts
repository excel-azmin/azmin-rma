import { IsNotEmpty, IsString } from 'class-validator';

export class SalesReturnCancelDto {
  @IsNotEmpty()
  @IsString()
  returnInvoiceName: string;

  @IsNotEmpty()
  @IsString()
  saleInvoiceName: string;
}
