import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Query,
  Param,
  Req,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import {
  JobQueueListQueryDto,
  ExcelDataImportWebhookDto,
} from '../../../constants/listing-dto/job-queue-list-query.dto';
import { JobQueueAggregateService } from '../../aggregates/job-queue-aggregate/job-queue-aggregate.service';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { SYSTEM_MANAGER } from '../../../constants/app-strings';
import { FileInterceptor } from '@nestjs/platform-express';
import { throwError } from 'rxjs';

@Controller('job_queue')
export class JobQueueController {
  constructor(private readonly aggregate: JobQueueAggregateService) {}

  @Post('v1/create')
  @UseGuards(TokenGuard)
  async create(@Body('jobId') jobId: string) {
    return await this.aggregate.create(jobId);
  }

  @Post('v1/retry')
  @UseGuards(TokenGuard)
  async retryJob(@Body('jobId') jobId: string) {
    return await this.aggregate.retryJob(jobId);
  }

  @Post('v1/reset')
  @UseGuards(TokenGuard)
  resetJob(@Body('jobId') jobId: string) {
    return this.aggregate.resetJob(jobId);
  }

  @Post('v1/resync')
  @UseGuards(TokenGuard)
  resyncJob(@Body('jobId') jobId: string, @Req() req) {
    return this.aggregate.syncJob(jobId, req);
  }

  @Get('v1/get_exported_job/:jobId')
  @UseGuards(TokenGuard)
  async retrieve(@Param('jobId') jobId: string) {
    return await this.aggregate.getOneDataImportJob(jobId);
  }

  @Post('v1/webhook')
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  async jobUpdated(@Body() jobPayload: ExcelDataImportWebhookDto) {
    return await this.aggregate.jobUpdated(jobPayload);
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  async list(@Query() query: JobQueueListQueryDto, @Req() req) {
    const { offset = 0, limit = 10, sort, filter_query } = query;
    let filter = {};
    try {
      filter = JSON.parse(filter_query);
    } catch {
      filter;
    }
    return await this.aggregate.list(
      offset,
      limit,
      sort,
      filter_query,
      req.token,
    );
  }

  @Post('v1/delete_empty_jobs')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  validateSerialNo(@UploadedFile('file') file, @Req() req) {
    if (!file) {
      return throwError(
        new BadRequestException(
          'Items file is mandatory, please provide list of items to sync.',
        ),
      );
    }
    return this.aggregate.deleteEmptyJobs(file, req);
  }
}
