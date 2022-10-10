import {
  Controller,
  All,
  Req,
  Param,
  Query,
  Body,
  Headers,
} from '@nestjs/common';
import { CommandService } from '../../aggregates/command/command.service';

@Controller('command')
export class CommandController {
  constructor(private readonly command: CommandService) {}

  @All('user/*')
  makeUserRequest(
    @Param() params,
    @Query() query,
    @Body() payload,
    @Req() req,
    @Headers() headers,
  ) {
    return this.command.makeRequest(
      req.method,
      params,
      query,
      payload,
      headers,
    );
  }
}
