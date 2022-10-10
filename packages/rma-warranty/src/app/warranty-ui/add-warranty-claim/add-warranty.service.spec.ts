import { TestBed } from '@angular/core/testing';

import { AddWarrantyService } from './add-warranty.service';
import {
  StorageService,
  STORAGE_TOKEN,
} from '../../api/storage/storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddWarrantyService', () => {
  let service: AddWarrantyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: STORAGE_TOKEN, useValue: {} },
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve('ITEM'),
            getItems: (...args) => Promise.resolve([]),
          },
        },
      ],
    });
    service = TestBed.inject(AddWarrantyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
