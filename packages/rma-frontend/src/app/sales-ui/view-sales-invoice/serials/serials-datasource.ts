import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs';
import { SerialItem, Item } from './serials.component';

export class SerialDataSource extends DataSource<SerialItem> {
  itemSubject = new BehaviorSubject<SerialItem[]>([]);

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

export class ItemDataSource extends DataSource<Item> {
  itemSubject = new BehaviorSubject<Item[]>([]);

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

export class DeliveredSerial {
  serial_no?: string;
  item_code?: string;
  purchase_date?: string;
  purchase_rate?: number;
  supplier?: string;
  company?: string;
  purchase_document_no?: string;
  warehouse?: string;
}

export interface DeliveryNoteItemInterface {
  item_code?: string;
  item_name?: string;
  qty?: number;
  rate?: number;
  has_serial_no?: number;
  against_sales_invoice?: string;
  warranty_date?: string;
  amount?: number;
  serial_no?: string[];
  excel_serials?: string;
  cost_center?: string;
}
