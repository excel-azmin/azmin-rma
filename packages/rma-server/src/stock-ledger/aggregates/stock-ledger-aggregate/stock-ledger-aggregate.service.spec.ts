import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';
import { StockLedgerAggregateService } from './stock-ledger-aggregate.service';

describe('SerialNoAggregateService', () => {
  let service: StockLedgerAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockLedgerAggregateService,
        {
          provide: StockLedgerService,
          useValue: {},
        },
        {
          provide: SettingsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StockLedgerAggregateService>(
      StockLedgerAggregateService,
    );
  });
  StockLedgerAggregateService;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
