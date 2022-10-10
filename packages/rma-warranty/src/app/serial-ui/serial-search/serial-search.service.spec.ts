import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SerialSearchService } from './serial-search.service';
import { StorageService } from '../../api/storage/storage.service';

describe('SerialSearchService', () => {
  let service: SerialSearchService;

  beforeEach(() => {
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
    });
    service = TestBed.inject(SerialSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
