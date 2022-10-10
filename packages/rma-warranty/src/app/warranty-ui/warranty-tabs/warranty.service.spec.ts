import { TestBed } from '@angular/core/testing';

import { WarrantyService } from '../warranty-tabs/warranty.service';
import { HttpErrorHandler } from '../../common/interfaces/services/http-error-handler/http-error-handler.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  StorageService,
  STORAGE_TOKEN,
} from '../../api/storage/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StockEntryService } from '../view-warranty-claims/stock-entry/services/stock-entry/stock-entry.service';
import { of } from 'rxjs';

describe('WarrantyService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HttpErrorHandler,
          useValue: {
            handleError<T>(...args) {},
            createHandleError(...args) {},
          },
        },
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve('Item'),
            getItems: (...args) => Promise.resolve({}),
          },
        },
        {
          provide: StockEntryService,
          useValue: {
            getWarrantyClaimsList: (...args) => of([{}]),
          },
        },
        { provide: STORAGE_TOKEN, useValue: {} },
        {
          provide: MatSnackBar,
          useValue: {},
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: WarrantyService = TestBed.get(WarrantyService);
    expect(service).toBeTruthy();
  });
});
