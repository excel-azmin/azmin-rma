import { Controller, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { DirectService } from '../../aggregates/direct/direct.service';
import { TokenGuard } from '../../../auth/guards/token.guard';

@Controller('direct')
export class DirectController {
  constructor(private readonly direct: DirectService) {}

  @Get('connect')
  @UseGuards(TokenGuard)
  connectFrappe(@Query('redirect') redirect, @Res() res: Response, @Req() req) {
    const { token } = req;
    this.direct.connectClientForUser(redirect, token).subscribe({
      next: success => res.redirect(success.redirect),
      error: ({ error }) => {
        res.status(500);
        res.json({ message: error.message });
      },
    });
  }

  @Get('callback')
  oauth2callback(
    @Res() res: Response,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    this.direct.oauth2callback(res, code, state);
  }

  @Get('v1/verify_backend_connection')
  @UseGuards(TokenGuard)
  async verifyBackendConnection(@Req() req) {
    const { token } = req;
    return await this.direct.verifyBackendConnection(token.email);
  }

  @Get('v1/profile')
  @UseGuards(TokenGuard)
  getProfile(@Req() req) {
    const { token, query } = req;
    return this.direct.getProfile(token, query);
  }
}
