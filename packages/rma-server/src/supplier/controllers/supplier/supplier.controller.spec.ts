import { Test, TestingModule } from '@nestjs/testing';
import { SupplierController } from './supplier.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { HttpService } from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';

describe('Supplier Controller', () => {
  let controller: SupplierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
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
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<SupplierController>(SupplierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
