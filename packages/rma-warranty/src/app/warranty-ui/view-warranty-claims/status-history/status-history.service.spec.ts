import { TestBed } from '@angular/core/testing';

import { StatusHistoryService } from './status-history.service';
import { STORAGE_TOKEN } from '../../../api/storage/storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StatusHistoryService', () => {
  let service: StatusHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: STORAGE_TOKEN, useValue: {} }],
    });
    service = TestBed.inject(StatusHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
