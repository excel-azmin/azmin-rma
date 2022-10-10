import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockEntryService } from './stock-entry.service';
import { StockEntry } from './stock-entry.entity';

describe('warrantyClaimService', () => {
  let service: StockEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockEntryService,
        {
          provide: getRepositoryToken(StockEntry),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StockEntryService>(StockEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
