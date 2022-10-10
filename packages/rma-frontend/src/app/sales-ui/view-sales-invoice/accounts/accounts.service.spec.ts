import { TestBed } from '@angular/core/testing';

import { AccountsService } from './accounts.service';
import { STORAGE_TOKEN } from '../../../api/storage/storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AccountsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: STORAGE_TOKEN, useValue: {} }],
    }),
  );

  it('should be created', () => {
    const service: AccountsService = TestBed.get(AccountsService);
    expect(service).toBeTruthy();
  });
});
