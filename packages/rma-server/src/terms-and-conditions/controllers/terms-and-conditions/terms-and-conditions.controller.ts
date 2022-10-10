import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { TermsAndConditionsAggregateService } from '../../aggregates/terms-and-conditions-aggregate/terms-and-conditions-aggregate.service';
import {
  CreateTermsAndConditionsDto,
  UpdateTermsAndConditionsDto,
} from '../../entity/terms-and-conditions/terms-and-conditions.dto';

@Controller('terms_and_conditions')
export class TermsAndConditionsController {
  constructor(
    private readonly termsAndConditionsAggregateService: TermsAndConditionsAggregateService,
  ) {}

  @Post('v1/create')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @Body() termsAndConditionsPayload: CreateTermsAndConditionsDto,
    @Req() req,
  ) {
    return await this.termsAndConditionsAggregateService.createTermsAndConditions(
      termsAndConditionsPayload,
    );
  }

  @Post('v1/update')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Body() termsAndConditionsPayload: UpdateTermsAndConditionsDto,
    @Req() req,
  ) {
    return await this.termsAndConditionsAggregateService.updateTermsAndConditions(
      termsAndConditionsPayload,
    );
  }

  @Post('v1/delete/:uuid')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async delete(@Param('uuid') uuid: string) {
    return await this.termsAndConditionsAggregateService.deleteTermsAndConditions(
      uuid,
    );
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  async getTermsAndConditionsList(
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('sort') sort: string,
  ) {
    return await this.termsAndConditionsAggregateService.list(
      +offset,
      +limit,
      search,
      sort,
    );
  }

  @Get('v1/get/:uuid')
  @UseGuards(TokenGuard)
  async getTermsAndConditions(@Param('uuid') uuid) {
    return await this.termsAndConditionsAggregateService.getTermsAndConditions(
      uuid,
    );
  }
}
