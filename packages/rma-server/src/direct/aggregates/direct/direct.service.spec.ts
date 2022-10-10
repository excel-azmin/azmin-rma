import { Test, TestingModule } from '@nestjs/testing';
import { DirectService } from './direct.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { RequestStateService } from '../../entities/request-state/request-state.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';
import { HttpModule } from '@nestjs/common';

describe('DirectService', () => {
  let service: DirectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        DirectService,
        {
          provide: RequestStateService,
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
          provide: TokenCacheService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DirectService>(DirectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
