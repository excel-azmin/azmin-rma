import { TestBed } from '@angular/core/testing';

import { ProblemService } from './problem.service';
import { StorageService } from '../../../api/storage/storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProblemService', () => {
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
    const service: ProblemService = TestBed.get(ProblemService);
    expect(service).toBeTruthy();
  });
});
