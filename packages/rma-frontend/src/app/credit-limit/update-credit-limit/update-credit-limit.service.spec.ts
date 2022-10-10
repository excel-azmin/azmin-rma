import { TestBed } from '@angular/core/testing';

import { UpdateCreditLimitService } from './update-credit-limit.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from '../../api/storage/storage.service';

describe('UpdateCreditLimitService', () => {
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
    const service: UpdateCreditLimitService = TestBed.get(
      UpdateCreditLimitService,
    );
    expect(service).toBeTruthy();
  });
});
