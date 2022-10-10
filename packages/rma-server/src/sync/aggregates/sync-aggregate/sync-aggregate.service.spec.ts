import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { SyncAggregateService } from './sync-aggregate.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';

describe('SyncAggregateService', () => {
  let service: SyncAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncAggregateService,
        { provide: ServerSettingsService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
      ],
    }).compile();

    service = module.get<SyncAggregateService>(SyncAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
