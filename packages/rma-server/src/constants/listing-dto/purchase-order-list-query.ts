import { IsOptional } from 'class-validator';

export class PurchaseOrderListQueryDto {
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
}
