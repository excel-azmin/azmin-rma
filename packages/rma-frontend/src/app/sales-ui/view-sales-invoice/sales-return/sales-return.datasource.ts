import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SalesReturnService } from './sales-return.service';

export interface ListingData {
  name: string;
  posting_date: string;
  title: string;
  total: string;
  status: string;
  owner: string;
  modified_by: string;
}

export class SalesReturnDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private salesReturnService: SalesReturnService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ListingData[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(sales_invoice: string, pageIndex = 0, pageSize = 30) {
    this.loadingSubject.next(true);
    this.salesReturnService
      .getSalesReturnList(pageIndex, pageSize, [
        ['against_sales_invoice', '=', `${sales_invoice}`],
        ['is_return', '=', '1'],
      ])
      .pipe(
        map((items: ListingData[]) => {
          this.data = items;
          this.offset = (pageIndex + 1) * pageSize;
          this.length = items.length;
          return items;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => this.itemSubject.next(items));
  }
}
