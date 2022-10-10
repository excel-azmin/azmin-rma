import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ItemPriceService } from './item-price.service';
import { StorageService } from '../../api/storage/storage.service';

describe('ItemPriceService', () => {
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
    const service: ItemPriceService = TestBed.get(ItemPriceService);
    expect(service).toBeTruthy();
  });
});
