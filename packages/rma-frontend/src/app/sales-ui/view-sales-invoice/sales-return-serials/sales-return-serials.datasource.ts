import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SalesReturnSerialsService } from './sales-return-serials.service';

export interface ListingData {
  name: string;
  item_name: string;
}

export class SalesReturnSerialsDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private salesReturnSerialsService: SalesReturnSerialsService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ListingData[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(salesInvoiceName: string, pageIndex = 0, pageSize = 15) {
    this.loadingSubject.next(true);
    this.salesReturnSerialsService
      .getSalesReturnSerialList(salesInvoiceName, pageIndex, pageSize)
      .pipe(
        map(
          (itemsAndTotalLengthObject: {
            items: ListingData[];
            length: number;
          }) => {
            this.data = itemsAndTotalLengthObject.items;
            this.offset = (pageIndex + 1) * pageSize;
            this.length = itemsAndTotalLengthObject.length;
            return itemsAndTotalLengthObject.items;
          },
        ),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => this.itemSubject.next(items));
  }
}
