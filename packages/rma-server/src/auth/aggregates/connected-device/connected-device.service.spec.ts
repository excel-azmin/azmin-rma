import { Test, TestingModule } from '@nestjs/testing';
import { ConnectedDeviceService } from './connected-device.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { HttpService } from '@nestjs/common';

describe('ConnectedDeviceService', () => {
  let service: ConnectedDeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectedDeviceService,
        { provide: ServerSettingsService, useValue: {} },
        { provide: HttpService, useValue: {} },
      ],
    }).compile();

    service = module.get<ConnectedDeviceService>(ConnectedDeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
