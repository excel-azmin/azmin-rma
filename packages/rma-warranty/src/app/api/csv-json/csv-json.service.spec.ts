import { TestBed } from '@angular/core/testing';
import { CsvJsonService } from './csv-json.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from '../storage/storage.service';
import { MatDialog } from '@angular/material/dialog';

describe('csvJsonService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CsvJsonService,
        {
          provide: MatSnackBar,
          useValue: {},
        },
        {
          provide: MatDialog,
          useValue: {},
        },
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
    const service: CsvJsonService = TestBed.get(CsvJsonService);
    expect(service).toBeTruthy();
  });
});
