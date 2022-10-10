import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { RevokeExpiredFrappeTokensService } from './revoke-expired-frappe-tokens.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientTokenManagerService } from '../../aggregates/client-token-manager/client-token-manager.service';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';

describe('RevokeExpiredFrappeTokensService', () => {
  let service: RevokeExpiredFrappeTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RevokeExpiredFrappeTokensService,
        { provide: ServerSettingsService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: ErrorLogService, useValue: {} },
        { provide: TokenCacheService, useValue: {} },
        { provide: AGENDA_TOKEN, useValue: {} },
      ],
    }).compile();

    service = module.get<RevokeExpiredFrappeTokensService>(
      RevokeExpiredFrappeTokensService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
