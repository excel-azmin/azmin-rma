import { IsOptional } from 'class-validator';

export class JobQueueListQueryDto {
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

export class ExcelDataImportWebhookDto {
  @IsOptional()
  import_status: string;

  @IsOptional()
  log_details: string;

  @IsOptional()
  name: string;

  @IsOptional()
  reference_doctype: string;
}
