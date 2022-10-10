import { TestBed } from '@angular/core/testing';

import { SalesService } from './sales.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { STORAGE_TOKEN } from '../../api/storage/storage.service';
import { of } from 'rxjs';
import { MaterialModule } from '../../material/material.module';

describe('SalesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MaterialModule],
      providers: [
        {
          provide: STORAGE_TOKEN,
          useValue: {
            getItemAsync: (...args) => of({}),
          },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: SalesService = TestBed.get(SalesService);
    expect(service).toBeTruthy();
  });
});
