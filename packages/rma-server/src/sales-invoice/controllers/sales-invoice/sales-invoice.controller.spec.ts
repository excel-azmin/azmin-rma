import { Test, TestingModule } from '@nestjs/testing';
import { SalesInvoiceController } from './sales-invoice.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { HttpService } from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { SalesInvoiceAggregateService } from '../../aggregates/sales-invoice-aggregate/sales-invoice-aggregate.service';
import { SalesInvoiceResetAggregateService } from '../../aggregates/sales-invoice-reset-aggregate/sales-invoice-reset-aggregate.service';

describe('SalesInvoice Controller', () => {
  let controller: SalesInvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesInvoiceController],
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
          provide: TokenCacheService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: SalesInvoiceAggregateService,
          useValue: {},
        },
        {
          provide: SalesInvoiceResetAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<SalesInvoiceController>(SalesInvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
