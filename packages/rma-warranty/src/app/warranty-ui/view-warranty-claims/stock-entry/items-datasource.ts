import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs';
import { StockEntryItems } from '../../../common/interfaces/warranty.interface';

export class ItemsDataSource extends DataSource<StockEntryItems> {
  itemSubject = new BehaviorSubject<StockEntryItems[]>([]);

  constructor() {
    super();
  }

  connect() {
    return this.itemSubject.asObservable();
  }
  disconnect() {
    this.itemSubject.complete();
  }

  loadItems(items) {
    this.itemSubject.next(items);
  }

  data() {
    return this.itemSubject.value;
  }

  update(data) {
    this.itemSubject.next(data);
  }
}
