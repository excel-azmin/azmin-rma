import { Test, TestingModule } from '@nestjs/testing';
import { WarrantyClaimController } from './warranty-claim.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { HttpService } from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { WarrantyClaimAggregateService } from '../../aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';

describe('WarrantyClaim Controller', () => {
  let controller: WarrantyClaimController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarrantyClaimController],
      providers: [
        {
          provide: CommandBus,
          useValue: {},
        },
        {
          provide: QueryBus,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: TokenCacheService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: WarrantyClaimAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<WarrantyClaimController>(WarrantyClaimController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
