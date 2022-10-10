import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { TokenGuard } from '../../auth/guards/token.guard';
import { ErrorLogService } from '../error-log-service/error-log.service';
import { RoleGuard } from '../../auth/guards/role.guard';
import { SYSTEM_MANAGER } from '../../constants/app-strings';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('error_log')
export class ErrorLogController {
  constructor(private readonly errorLogService: ErrorLogService) {}

  @Get('v1/list')
  @UseGuards(TokenGuard, RoleGuard)
  @Roles(SYSTEM_MANAGER)
  listCreditNote(@Req() req, @Query() query) {
    const { offset, limit, sort, filter_query } = query;
    let filter;
    try {
      filter = JSON.parse(filter_query);
    } catch {
      filter;
    }
    return this.errorLogService.list(offset, limit, sort, filter);
  }
}
