import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DeliveryNoteController } from './delivery-note.controller';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { DeliveryNoteAggregateService } from '../../aggregates/delivery-note-aggregate/delivery-note-aggregate.service';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ConnectService } from '../../../auth/aggregates/connect/connect.service';
import { QueryBus, CommandBus } from '@nestjs/cqrs';

describe('DeliveryNote Controller', () => {
  let controller: DeliveryNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryNoteController],
      providers: [
        {
          provide: DeliveryNoteAggregateService,
          useValue: {},
        },
        { provide: TokenCacheService, useValue: {} },
        { provide: SettingsService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: ConnectService, useValue: {} },
        { provide: Reflector, useValue: {} },
        { provide: QueryBus, useValue: {} },
        { provide: CommandBus, useValue: {} },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();

    controller = module.get<DeliveryNoteController>(DeliveryNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
