import { TestBed } from '@angular/core/testing';

import { JobsService } from './jobs.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { STORAGE_TOKEN } from '../../api/storage/storage.service';

describe('JobsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: STORAGE_TOKEN,
          useValue: { getItem: (...args) => Promise.resolve() },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: JobsService = TestBed.get(JobsService);
    expect(service).toBeTruthy();
  });
});
