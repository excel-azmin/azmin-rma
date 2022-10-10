import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SalesService } from '../sales-ui/services/sales.service';
import { map, catchError, finalize } from 'rxjs/operators';

export interface ListingData {
  uuid: string;
  customer_name: string;
  territory: string;
  remaining_balance: number;
  name: string;
  credit_limit: string;
}

export interface ItemListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class CustomerDataSource extends DataSource<ListingData> {
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
      .relayCustomerList(pageIndex, pageSize, filters)
      .pipe(
        map((items: ListingData[]) => {
          this.data = items;
          return items;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => this.itemSubject.next(items));

    this.salesService.getDoctypeCount('Customer', countFilter).subscribe({
      next: res => {
        this.length = res;
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
