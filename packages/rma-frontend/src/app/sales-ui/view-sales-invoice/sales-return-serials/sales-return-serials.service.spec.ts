import { TestBed } from '@angular/core/testing';

import { SalesReturnSerialsService } from './sales-return-serials.service';
import { STORAGE_TOKEN } from '../../../api/storage/storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SalesReturnService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: STORAGE_TOKEN, useValue: {} }],
    }),
  );

  it('should be created', () => {
    const service: SalesReturnSerialsService = TestBed.get(
      SalesReturnSerialsService,
    );
    expect(service).toBeTruthy();
  });
});
