import { TestBed } from '@angular/core/testing';
import { TimeService } from './time.service';
import { StorageService } from '../storage/storage.service';

describe('TimeService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        TimeService,
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
    const service: TimeService = TestBed.get(TimeService);
    expect(service).toBeTruthy();
  });
});
