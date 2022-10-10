import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Req,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import {
  CreateProblemDto,
  UpdateProblemDto,
} from '../../entity/problem/problem-dto';
import { ProblemAggregateService } from '../../aggregates/problem-aggregate/problem-aggregate.service';

@Controller('problem')
export class ProblemController {
  constructor(
    private readonly problemAggregateService: ProblemAggregateService,
  ) {}

  @Post('v1/create')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() problemPayload: CreateProblemDto, @Req() req) {
    return await this.problemAggregateService.createProblem(problemPayload);
  }

  @Post('v1/update')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Body() problemPayload: UpdateProblemDto, @Req() req) {
    return await this.problemAggregateService.updateProblem(problemPayload);
  }

  @Post('v1/delete/:uuid')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async delete(@Param('uuid') uuid: string) {
    return await this.problemAggregateService.deleteProblem(uuid);
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  async getProblemList(
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('sort') sort: string,
  ) {
    return await this.problemAggregateService.list(
      +offset,
      +limit,
      search,
      sort,
    );
  }

  @Get('v1/get/:uuid')
  @UseGuards(TokenGuard)
  async getProblem(@Param('uuid') uuid) {
    return await this.problemAggregateService.getProblem(uuid);
  }
}
