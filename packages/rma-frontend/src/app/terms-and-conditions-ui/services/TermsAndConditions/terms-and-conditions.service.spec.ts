import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StorageService } from '../../../api/storage/storage.service';

import { TermsAndConditionsService } from './terms-and-conditions.service';

describe('TermsAndConditionsService', () => {
  let service: TermsAndConditionsService;

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
    service = TestBed.inject(TermsAndConditionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
