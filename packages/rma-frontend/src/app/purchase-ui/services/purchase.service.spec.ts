import { TestBed } from '@angular/core/testing';

import { PurchaseService } from './purchase.service';
import { STORAGE_TOKEN } from '../../api/storage/storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PurchaseService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: STORAGE_TOKEN, useValue: {} }],
    }),
  );

  it('should be created', () => {
    const service: PurchaseService = TestBed.get(PurchaseService);
    expect(service).toBeTruthy();
  });
});
