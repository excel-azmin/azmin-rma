import { Injectable } from '@nestjs/common';
import { SERVICE } from './constants/app-strings';
import { SetupService } from './system-settings/controllers/setup/setup.service';
import { PLEASE_RUN_SETUP } from './constants/messages';

@Injectable()
export class AppService {
  constructor(private readonly idpSetupService: SetupService) {}

  async info() {
    let info;
    try {
      info = await this.idpSetupService.getInfo();
    } catch (error) {
      info = {
        message: PLEASE_RUN_SETUP,
      };
    }

    // await this.cacheService.keys('test', info);
    // const cachedData = await this.cacheService.match('test');
    // console.log('data set to cache', cachedData);
    return info;
  }

  getRoot() {
    return { service: SERVICE };
  }
}
