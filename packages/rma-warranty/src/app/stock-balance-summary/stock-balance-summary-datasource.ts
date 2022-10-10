import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StockBalanceSummaryService } from './services/stock-balance-summary/stock-balance-summary.service';

export interface ListingData {
  uuid: string;
  problem_name: string;
}

export interface ItemListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class StockBalanceSummaryDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(
    private readonly stockSummaryService: StockBalanceSummaryService,
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ListingData[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(filter = '', sortOrder = 'ASC', pageIndex = 0, pageSize = 30) {
    if (sortOrder === '') sortOrder = 'ASC';
    this.loadingSubject.next(true);
    this.stockSummaryService
      .getProblemList(filter, sortOrder, pageIndex, pageSize)
      .pipe(
        map(res => {
          this.data = res.docs;
          this.length = res.length;
          this.offset = res.offset;
          return res.docs;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => {
        this.itemSubject.next(items);
      });
  }

  getData() {
    return this.itemSubject.value;
  }

  update(data) {
    this.itemSubject.next(data);
  }
}
