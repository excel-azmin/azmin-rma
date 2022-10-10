import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseInvoiceController } from './purchase-invoice.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { HttpService } from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';

describe('PurchaseInvoice Controller', () => {
  let controller: PurchaseInvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseInvoiceController],
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
          provide: SettingsService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<PurchaseInvoiceController>(
      PurchaseInvoiceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
