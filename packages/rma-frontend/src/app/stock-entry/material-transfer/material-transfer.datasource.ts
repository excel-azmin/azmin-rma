import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs';

export class MaterialTransferDataSource extends DataSource<StockEntryRow> {
  itemSubject = new BehaviorSubject<StockEntryRow[]>([]);

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

export class StockEntryRow {
  s_warehouse?: string;
  t_warehouse?: string;
  warranty_date?: string;
  item_code: string;
  transferWarehouse?: string;
  has_serial_no?: number;
  item_name: string;
  qty: number;
  serial_no?: any;
  [key: string]: any;
}

export class MaterialTransferDto {
  stock_entry_type: string;
  uuid?: string;
  company: string;
  territory: string;
  remarks: string;
  customer?: string;
  posting_date: string;
  posting_time: string;
  items: StockEntryRow[];
  item_data: any;
  status?: string;
  project?: string;
}
