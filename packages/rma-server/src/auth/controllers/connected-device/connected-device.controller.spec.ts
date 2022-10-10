import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { ConnectedDeviceController } from './connected-device.controller';
import { ConnectedDeviceService } from '../../aggregates/connected-device/connected-device.service';
import { TokenGuard } from '../../guards/token.guard';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../entities/token-cache/token-cache.service';

describe('ConnectedDevice Controller', () => {
  let controller: ConnectedDeviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectedDeviceController],
      providers: [
        { provide: ConnectedDeviceService, useValue: {} },
        { provide: ServerSettingsService, useValue: {} },
        { provide: TokenCacheService, useValue: {} },
        { provide: HttpService, useValue: {} },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<ConnectedDeviceController>(
      ConnectedDeviceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
