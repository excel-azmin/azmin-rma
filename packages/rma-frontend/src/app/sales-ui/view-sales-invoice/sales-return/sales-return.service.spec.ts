import { TestBed } from '@angular/core/testing';

import { SalesReturnService } from './sales-return.service';
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
    const service: SalesReturnService = TestBed.get(SalesReturnService);
    expect(service).toBeTruthy();
  });
});
