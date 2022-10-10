import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { SalesService } from '../../sales-ui/services/sales.service';

export interface ListingData {
  actual_qty: number;
  item_code: string;
  name: string;
  ordered_qty: number;
  projected_qty: number;
  stock_value: number;
  warehouse: string;
}

export interface ItemListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class StockAvailabilityDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private readonly salesService: SalesService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ListingData[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(pageIndex = 0, pageSize = 30, filters = [], countFilter = []) {
    this.loadingSubject.next(true);
    this.salesService
      .relayStockAvailabilityList(pageIndex, pageSize, filters)
      .pipe(
        map((items: ListingData[]) => {
          this.data = items;
          return items;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => this.itemSubject.next(items));

    this.salesService.getDocCount(pageIndex, pageSize, filters).subscribe({
      next: res => {
        if (res) {
          res.forEach(element => {
            this.length = element.count;
          });
        } else {
          this.length = 0;
        }
      },
    });
  }

  getData() {
    return this.itemSubject.value;
  }

  update(data) {
    this.itemSubject.next(data);
  }
}
