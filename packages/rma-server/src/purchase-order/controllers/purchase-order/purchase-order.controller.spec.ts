import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { HttpService } from '@nestjs/common';
import { PurchaseOrderController } from './purchase-order.controller';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { PurchaseOrderAggregateService } from '../../aggregates/purchase-order-aggregate/purchase-order-aggregate.service';

describe('PurchaseOrder Controller', () => {
  let controller: PurchaseOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseOrderController],
      providers: [
        { provide: QueryBus, useValue: {} },
        { provide: ServerSettingsService, useValue: {} },
        { provide: TokenCacheService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: SettingsService, useValue: {} },
        { provide: QueryBus, useValue: {} },
        { provide: PurchaseOrderAggregateService, useValue: {} },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<PurchaseOrderController>(PurchaseOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
