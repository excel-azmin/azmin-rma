import { Test, TestingModule } from '@nestjs/testing';
import { ConnectService } from './connect.service';
import { TokenCacheService } from '../../entities/token-cache/token-cache.service';
import { ClientTokenManagerService } from '../client-token-manager/client-token-manager.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { HttpService } from '@nestjs/common';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';
import { TerritoryService } from '../../../customer/entity/territory/territory.service';

describe('ConnectService', () => {
  let service: ConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectService,
        {
          provide: TokenCacheService,
          useValue: {},
        },
        {
          provide: ClientTokenManagerService,
          useValue: {},
        },
        {
          provide: ErrorLogService,
          useValue: {},
        },
        {
          provide: SettingsService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: TerritoryService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ConnectService>(ConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
