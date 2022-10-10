import { Test, TestingModule } from '@nestjs/testing';
import { TerritoryAggregateService } from './territory-aggregate.service';
import { TerritoryService } from '../../entity/territory/territory.service';
import { HttpService } from '@nestjs/common';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';

describe('TerritoryAggregateService', () => {
  let service: TerritoryAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TerritoryAggregateService,
        { provide: TerritoryService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: SettingsService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
      ],
    }).compile();

    service = module.get<TerritoryAggregateService>(TerritoryAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
