import { Test, TestingModule } from '@nestjs/testing';
import { TokenGuard } from '../../auth/guards/token.guard';
import { StockLedgerController } from './stock-ledger.controller';
import { StockLedgerAggregateService } from '../aggregates/stock-ledger-aggregate/stock-ledger-aggregate.service';

describe('StockLedger Controller', () => {
  let controller: StockLedgerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockLedgerController],
      providers: [
        {
          provide: StockLedgerAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<StockLedgerController>(StockLedgerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
