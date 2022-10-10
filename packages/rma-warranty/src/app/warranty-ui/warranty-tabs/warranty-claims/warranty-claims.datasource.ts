import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { WarrantyService } from '../warranty.service';

export interface WarrantyClaimsListingData {
  claim: string;
  company: string;
  supplier: string;
  date: string;
  items: any[];
}

export interface ListResponse {
  docs: WarrantyClaimsListingData[];
  length: number;
  offset: number;
}
export class WarrantyClaimsDataSource extends DataSource<WarrantyClaimsListingData> {
  data: WarrantyClaimsListingData[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<WarrantyClaimsListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private model: string, private listingService: WarrantyService) {
    super();
  }

  connect(
    collectionViewer: CollectionViewer,
  ): Observable<WarrantyClaimsListingData[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(filter = '', sortOrder = 'asc', pageIndex = 0, pageSize = 30) {
    this.loadingSubject.next(true);
    this.listingService
      .findModels(this.model, filter, sortOrder, pageIndex, pageSize)
      .pipe(
        map((res: ListResponse) => {
          this.data = res.docs;
          this.offset = res.offset;
          this.length = res.length;
          return res.docs;
        }),
        catchError(() => of(WARRANTY_CLAIM_MOCK_DATA)),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => this.itemSubject.next(items));
  }
}

export const WARRANTY_CLAIM_MOCK_DATA = [
  {
    claim: '00001',
    company: 'ExcelBd',
    supplier: 'Dhaka central dealer',
    date: 'Wed Jan 01 2020',
    items: [
      {
        serial_no: 1,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 2,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 3,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 4,
        item: 'TL-WR845N(UN0',
      },
    ],
  },
  {
    claim: '00002',
    company: 'Castlecraft',
    supplier: 'Dhaka central dealer',
    date: 'Friday Dec 29 2019',
    items: [
      {
        serial_no: 11,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 12,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 13,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 14,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 111,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 23,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 312,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 4123,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 1133241,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 112,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 753,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 4274,
        item: 'TL-WR845N(UN0',
      },
    ],
  },
  {
    claim: '00003',
    company: 'ExcelBd',
    supplier: 'Excelbd seller',
    date: 'Wed Feb 01 2020',
    items: [
      {
        serial_no: 1274,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 2274,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 273,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 4274,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 2724,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 327,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 2474,
        item: 'TL-WR845N(UN0',
      },
    ],
  },
  {
    claim: '00004',
    company: 'Castlecraft',
    supplier: 'Excelbd seller',
    date: 'Wed April 01 2020',
    items: [
      {
        serial_no: 7241,
        item: 'TL-WR845N(UN0',
      },
      {
        serial_no: 227424,
        item: 'TL-WR845N(UN0',
      },
    ],
  },
];
