import { Test, TestingModule } from '@nestjs/testing';
import { ClientTokenManagerService } from './client-token-manager.service';
import { TokenCacheService } from '../../entities/token-cache/token-cache.service';
import { HttpService } from '@nestjs/common';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('ClientTokenManagerService', () => {
  let service: ClientTokenManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientTokenManagerService,
        { provide: TokenCacheService, useValue: {} },
        { provide: ServerSettingsService, useValue: {} },
        { provide: HttpService, useValue: {} },
      ],
    }).compile();

    service = module.get<ClientTokenManagerService>(ClientTokenManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
