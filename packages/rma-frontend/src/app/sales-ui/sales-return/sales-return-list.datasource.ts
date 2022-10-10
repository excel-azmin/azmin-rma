import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SalesReturnService } from '../view-sales-invoice/sales-return/sales-return.service';
import { SalesService } from '../services/sales.service';

export interface ListingData {
  name: string;
  posting_date: string;
  title: string;
  total: number;
  status: string;
  owner: string;
  modified_by: string;
}

export class SalesReturnListDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);
  totalSubject = new BehaviorSubject<number>(0);
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private salesReturnService: SalesReturnService,
    private readonly salesService: SalesService,
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

  loadItems(pageIndex = 0, pageSize = 30, filters: any[], countFilter: any) {
    this.loadingSubject.next(true);
    this.salesReturnService
      .getSalesReturnList(pageIndex, pageSize, filters)
      .pipe(
        map((items: ListingData[]) => {
          this.data = items;
          return items;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => {
        this.calculateTotal(items);
        this.itemSubject.next(items);
      });

    this.salesService.getDoctypeCount('Delivery Note', countFilter).subscribe({
      next: res => {
        this.length = res;
      },
    });
  }

  calculateTotal(items: ListingData[]) {
    let total = 0;
    items.forEach(item => {
      total += item.total;
    });
    this.totalSubject.next(total);
  }
}
