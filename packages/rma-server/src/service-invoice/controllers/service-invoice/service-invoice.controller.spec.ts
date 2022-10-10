import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInvoiceController } from './service-invoice.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { HttpService } from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ServiceInvoiceAggregateService } from '../../../service-invoice/aggregates/service-invoice-aggregate/service-invoice-aggregate.service';

describe('ServiceInvoice Controller', () => {
  let controller: ServiceInvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceInvoiceController],
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
        {
          provide: ServiceInvoiceAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<ServiceInvoiceController>(ServiceInvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
