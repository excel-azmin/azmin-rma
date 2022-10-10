import { Injectable, BadRequestException } from '@nestjs/common';
import { INVALID_CODE, INVALID_STATE } from '../../../constants/messages';
import { SERVICE } from '../../../constants/app-strings';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

@Injectable()
export class ConnectedDeviceService {
  constructor(private readonly settings: ServerSettingsService) {}

  async relayCodeAndState(code: string, state: string, res) {
    const settings = await this.settings.find();
    const callbackProtocol = (settings && settings.callbackProtocol) || SERVICE;
    const url = `${callbackProtocol}://callback?code=${code}&state=${state}`;

    if (!code) {
      throw new BadRequestException(INVALID_CODE);
    }
    if (!state) {
      throw new BadRequestException(INVALID_STATE);
    }

    return res.redirect(url);
  }
}
