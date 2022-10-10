import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TerritoryController } from './territory.controller';
import { TerritoryAggregateService } from '../../aggregates/territory-aggregate/territory-aggregate.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { ConnectService } from '../../../auth/aggregates/connect/connect.service';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';

describe('Territory Controller', () => {
  let controller: TerritoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerritoryController],
      providers: [
        { provide: TerritoryAggregateService, useValue: {} },
        { provide: TokenCacheService, useValue: {} },
        { provide: SettingsService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: ConnectService, useValue: {} },
        { provide: Reflector, useValue: {} },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();

    controller = module.get<TerritoryController>(TerritoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
