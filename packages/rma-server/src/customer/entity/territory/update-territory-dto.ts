import { IsUUID, IsString } from 'class-validator';

export class UpdateTerritoryDto {
  @IsUUID()
  uuid: string;

  @IsString()
  name: string;

  @IsString()
  warehouse: string;
}
