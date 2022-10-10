import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockLedgerService } from './stock-ledger.service';
import { StockLedger } from './stock-ledger.entity';

describe('StockLedgerService', () => {
  let service: StockLedgerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockLedgerService,
        {
          provide: getRepositoryToken(StockLedger),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StockLedgerService>(StockLedgerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
