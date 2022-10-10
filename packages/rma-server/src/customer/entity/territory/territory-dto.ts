import { IsNotEmpty } from 'class-validator';

export class TerritoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  warehouse: string;
}
