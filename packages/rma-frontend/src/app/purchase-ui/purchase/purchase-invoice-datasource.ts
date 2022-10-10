import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { PurchaseService } from '../services/purchase.service';

export interface ListingData {
  uuid: string;
  supplier: string;
  status: string;
  total: number;
}

export interface ListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class PurchaseInvoiceDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;
  total = new BehaviorSubject<number>(0);

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private purchaseService: PurchaseService) {
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
    this.purchaseService
      .getPurchaseInvoiceList(sortOrder, pageIndex, pageSize, query)
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
        items.filter(item => {
          item.delivered_percent = this.getDeliveryProgress(item);
          return item;
        });
        this.calculateTotal(items);
        this.itemSubject.next(items);
      });
  }

  getDeliveryProgress(row: any) {
    return (
      (this.getHashSum(row.purchase_receipt_items_map) * 100) / row.total_qty
    );
  }

  getHashSum(hash: { [key: string]: number }) {
    return Object.values(hash)?.reduce((a, b) => a + b, 0) || 0;
  }

  calculateTotal(purchaseInvoices: ListingData[]) {
    let sum = 0;
    purchaseInvoices.forEach(invoice => {
      sum += invoice.total;
    });
    this.total.next(sum);
  }
}
