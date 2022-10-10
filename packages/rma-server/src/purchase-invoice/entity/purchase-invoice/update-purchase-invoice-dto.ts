import { IsNotEmpty } from 'class-validator';
export class UpdatePurchaseInvoiceDto {
  @IsNotEmpty()
  uuid: string;
}
