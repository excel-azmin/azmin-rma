import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs';

export class StockTransferItem {
  item_name: string;
  item_code: string;
  available_stock?: number;
  assigned: number;
  has_serial_no: boolean;
}

export class StockItemsDataSource extends DataSource<StockTransferItem> {
  itemSubject = new BehaviorSubject<StockTransferItem[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor() {
    super();
  }

  connect() {
    return this.itemSubject.asObservable();
  }

  disconnect() {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(items) {
    this.loadingSubject.next(true);
    this.itemSubject.next(items);
    this.loadingSubject.next(false);
  }

  data() {
    return this.itemSubject.value;
  }

  update(data) {
    this.itemSubject.next(data);
  }
}
