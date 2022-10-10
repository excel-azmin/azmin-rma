import { Test, TestingModule } from '@nestjs/testing';
import { TokenGuard } from '../../auth/guards/token.guard';
import { StockEntryController } from './stock-entry.controller';
import { StockEntryAggregateService } from '../aggregates/stock-entry-aggregate/stock-entry-aggregate.service';
import { WarrantyStockEntryAggregateService } from '../aggregates/warranty-stock-entry-aggregate/warranty-stock-entry-aggregate.service';

describe('StockEntry Controller', () => {
  let controller: StockEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockEntryController],
      providers: [
        {
          provide: StockEntryAggregateService,
          useValue: {},
        },
        {
          provide: WarrantyStockEntryAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<StockEntryController>(StockEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
