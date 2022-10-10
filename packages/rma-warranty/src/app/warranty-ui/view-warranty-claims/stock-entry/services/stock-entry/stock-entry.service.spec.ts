import { TestBed } from '@angular/core/testing';
import { StockEntryService } from './stock-entry.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { STORAGE_TOKEN } from '../../../../../api/storage/storage.service';

describe('StockEntryService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: STORAGE_TOKEN,
          useValue: {
            getItem: (...args) => Promise.resolve(),
          },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: StockEntryService = TestBed.get(StockEntryService);
    expect(service).toBeTruthy();
  });
});
