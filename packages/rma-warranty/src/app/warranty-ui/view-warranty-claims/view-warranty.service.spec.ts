import { TestBed } from '@angular/core/testing';

import { ViewWarrantyService } from './view-warranty.service';
import { STORAGE_TOKEN } from '../../api/storage/storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewWarrantyService', () => {
  let service: ViewWarrantyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: STORAGE_TOKEN,
          useValue: {
            getItem: (...args) => Promise.resolve('ITEM'),
            getItems: (...args) => Promise.resolve([]),
          },
        },
      ],
    });
    service = TestBed.inject(ViewWarrantyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
