import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StockEntryService } from './services/stock-entry/stock-entry.service';

export interface ListingData {
  stock_voucher_number: string;
  type: string;
  claim_no: string;
  description: string;
  posting_date: Date;
  createdBy: string;
}

export interface ListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class StockEntryListDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;
  total = new BehaviorSubject<number>(0);

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private StockEntryListService: StockEntryService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ListingData[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(sortOrder?, pageIndex = 0, pageSize = 30, query?) {
    this.loadingSubject.next(true);
    this.StockEntryListService.getStockEntryList(
      sortOrder,
      pageIndex,
      pageSize,
      query,
    )
      .pipe(
        map((res: ListResponse) => {
          this.data = res.docs;
          this.offset = res.offset;
          this.length = res.length;
          return res.docs;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => {
        this.itemSubject.next(items);
      });
  }
}
