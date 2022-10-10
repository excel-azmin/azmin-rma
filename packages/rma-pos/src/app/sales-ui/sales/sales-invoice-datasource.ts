import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import {
  map,
  catchError,
  finalize,
  concatMap,
  switchMap,
  toArray,
} from 'rxjs/operators';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { SalesService } from '../services/sales.service';

export interface ListingData {
  uuid: string;
  customer: string;
  submitted: boolean;
  status: string;
  total: number;
  outstanding_amount?: number;
  name?: string;
}

export interface ListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class SalesInvoiceDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;
  total = new BehaviorSubject<number>(0);
  dueAmountTotal = new BehaviorSubject<number>(0);
  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);
  disableRefresh = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private salesService: SalesService) {
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
    if (!sortOrder) {
      sortOrder = { created_on: 'desc' };
    }
    this.loadingSubject.next(true);
    this.salesService
      .getSalesInvoiceList(sortOrder, pageIndex, pageSize, query)
      .pipe(
        map((res: ListResponse) => {
          this.data = res.docs;
          this.offset = res.offset;
          this.length = res.length;
          return res.docs;
        }),
        catchError(error => of([])),
        finalize(() => this.loadingSubject.next(false)),
        switchMap(items => {
          return from(items).pipe(
            concatMap(item => {
              if (!item.name || item.status === 'Canceled') {
                item.outstanding_amount = 0;
                return of(item);
              }
              if (
                item.name &&
                item.status !== 'Canceled' &&
                !item.outstanding_amount &&
                item.outstanding_amount !== 0
              ) {
                return this.salesService
                  .updateOutstandingAmount(item.name)
                  .pipe(
                    switchMap((res: { outstanding_amount: number }) => {
                      item.outstanding_amount = res.outstanding_amount;
                      return of(item);
                    }),
                  );
              }
              return of(item);
            }),
            toArray(),
          );
        }),
      )
      .subscribe(items => {
        items.filter(item => {
          item.delivered_percent = this.getDeliveryProgress(item) || 0;
          return item;
        });
        this.itemSubject.next(items);
        this.calculateTotal(items);
      });
  }

  getDeliveryProgress(row: SalesInvoiceListInterface) {
    if (row.bundle_items_map && Object.keys(row.bundle_items_map).length) {
      return (
        (this.getHashSum(row.delivered_items_map) * 100) /
        this.getHashSum(row.bundle_items_map)
      );
    }
    return (this.getHashSum(row.delivered_items_map) * 100) / row.total_qty;
  }

  getHashSum(hash: { [key: string]: number }) {
    return Object.values(hash)?.reduce((a, b) => a + b, 0);
  }

  syncOutstandingAmount() {
    this.disableRefresh.next(true);
    return from(this.itemSubject.value).pipe(
      concatMap(item => {
        if (item.name && item.status !== 'Canceled') {
          return this.salesService.updateOutstandingAmount(item.name).pipe(
            switchMap((res: { outstanding_amount: number }) => {
              item.outstanding_amount = res.outstanding_amount;
              return of(item);
            }),
          );
        }
        return of(item);
      }),
      toArray(),
      switchMap(items => {
        this.disableRefresh.next(false);
        this.itemSubject.next(items);
        this.calculateTotal(items);
        return of({});
      }),
    );
  }

  calculateTotal(salesInvoices: ListingData[]) {
    let sum = 0,
      due_total = 0;
    salesInvoices.forEach(item => {
      sum += item.total;
      due_total += item.outstanding_amount;
    });
    this.total.next(sum);
    this.dueAmountTotal.next(due_total);
  }
}

export interface SalesInvoiceListInterface {
  bundle_items_map: { [key: string]: number };
  delivered_items_map: { [key: string]: number };
  total_qty: 12;
}
