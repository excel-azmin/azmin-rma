import { IsOptional } from 'class-validator';
// import { QuerySort } from './sort.enum';

export class WarrantyClaimsListQueryDto {
  @IsOptional()
  offset: number;

  @IsOptional()
  limit: number;

  @IsOptional()
  search: string;

  @IsOptional()
  sort: string;

  @IsOptional()
  filter_query: string;

  @IsOptional()
  territories: string;
}
