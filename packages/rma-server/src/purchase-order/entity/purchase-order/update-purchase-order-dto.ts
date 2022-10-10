import { IsNotEmpty } from 'class-validator';
export class UpdatePurchaseOrderDto {
  @IsNotEmpty()
  uuid: string;
}
