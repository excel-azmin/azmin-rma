import { Controller, Query, Get, Res } from '@nestjs/common';
import { ConnectedDeviceService } from '../../aggregates/connected-device/connected-device.service';

@Controller('connected_device')
export class ConnectedDeviceController {
  constructor(private readonly service: ConnectedDeviceService) {}

  @Get('callback')
  async relayCodeAndState(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res,
  ) {
    return await this.service.relayCodeAndState(code, state, res);
  }
}
