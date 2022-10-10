import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { SalesService } from '../../../sales-ui/services/sales.service';
import { APIResponse } from '../../../purchase-ui/view-purchase-invoice/purchase-assign-serials/purchase-serials-datasource';
import { DELIVERED_SERIALS_BY } from '../../../constants/app-string';
import { PurchaseService } from '../../../purchase-ui/services/purchase.service';
import { StockEntryService } from '../../../stock-entry/services/stock-entry/stock-entry.service';

export class CommonDeliveredSerialsDataSource extends DataSource<any> {
  itemSubject = new BehaviorSubject<any[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  data: any[];
  length: number;
  offset: number;

  loading$ = this.loadingSubject.asObservable();

  constructor(
    private readonly salesService: SalesService,
    private readonly purchaseService: PurchaseService,
    private readonly stockService: StockEntryService,
  ) {
    super();
  }

  connect() {
    return this.itemSubject.asObservable();
  }

  disconnect() {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(
    state: { type?: string; uuid?: string },
    search?,
    pageIndex = 0,
    pageSize = 30,
  ) {
    this.loadingSubject.next(true);
    this.getDeliveredItems(state, search || '', pageIndex, pageSize)
      .pipe(
        map((res: APIResponse) => {
          this.data = this.getFlatJson(res.docs);
          this.offset = res.offset;
          this.length = res.length;
          return this.data;
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

  getFlatJson(data: any[]) {
    const results = [];
    data.forEach(element => {
      const keys = Object.keys(element);
      keys.forEach(key => {
        if (
          typeof element[key] === 'object' &&
          element[key].constructor.name !== Object &&
          Object.keys(element[key]).length !== 0
        ) {
          element = { ...element, ...element[key] };
          delete element[key];
        }
      });
      results.push(element);
    });
    return results;
  }

  getDeliveredItems(
    state: { type?: string; uuid?: string },
    search,
    pageIndex,
    pageSize,
  ) {
    switch (state.type) {
      case DELIVERED_SERIALS_BY.sales_invoice_name:
        return this.salesService.getDeliveredSerials(
          state.uuid,
          search,
          pageIndex,
          pageSize,
        );

      case DELIVERED_SERIALS_BY.stock_entry_uuid:
        return this.stockService.getDeliveredSerials(
          state.uuid,
          search,
          pageIndex,
          pageSize,
        );

      default:
        return this.purchaseService.getDeliveredSerials(
          state.uuid,
          search,
          pageIndex,
          pageSize,
        );
    }
  }

  update(data) {
    this.itemSubject.next(data);
  }
}
