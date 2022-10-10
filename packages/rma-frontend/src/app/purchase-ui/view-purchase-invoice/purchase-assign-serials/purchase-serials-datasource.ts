import { DataSource } from '@angular/cdk/table';
import { DeliveredSerial } from '../../../sales-ui/view-sales-invoice/serials/serials-datasource';
import { BehaviorSubject, of } from 'rxjs';
import { PurchaseService } from '../../services/purchase.service';
import { map, catchError, finalize } from 'rxjs/operators';

export class PurchasedSerialsDataSource extends DataSource<DeliveredSerial> {
  itemSubject = new BehaviorSubject<DeliveredSerial[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);
  data: DeliveredSerial[];
  length: number;
  offset: number;

  loading$ = this.loadingSubject.asObservable();

  constructor(private purchaseService: PurchaseService) {
    super();
  }

  connect() {
    return this.itemSubject.asObservable();
  }
  disconnect() {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(purchase_invoice_name, search?, pageIndex = 0, pageSize = 30) {
    this.loadingSubject.next(true);
    this.purchaseService
      .getDeliveredSerials(purchase_invoice_name, search, pageIndex, pageSize)
      .pipe(
        map((res: APIResponse) => {
          this.data = res.docs;
          this.offset = res.offset;
          this.length = res.length;
          return res.docs;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe({
        next: success => {
          this.itemSubject.next(success);
        },
        error: err => {
          this.itemSubject.next([]);
        },
      });
  }

  update(data) {
    this.itemSubject.next(data);
  }
}

export interface APIResponse {
  docs: DeliveredSerial[];
  length: number;
  offset: number;
}
