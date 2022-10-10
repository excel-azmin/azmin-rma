import { TestBed } from '@angular/core/testing';

import { StockBalanceSummaryService } from './stock-balance-summary.service';
import { StorageService } from '../../../api/storage/storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StockBalanceSummaryService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve('ITEM'),
          },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: StockBalanceSummaryService = TestBed.get(
      StockBalanceSummaryService,
    );
    expect(service).toBeTruthy();
  });
});
