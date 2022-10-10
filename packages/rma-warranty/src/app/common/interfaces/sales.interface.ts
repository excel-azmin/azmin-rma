// import { Customer } from './customer.interface';

export class SalesInvoice {
  uuid: string;
  customer: string;
  company: string;
  addressDisplay: string;
  total: number;
  items: Array<Item>;
}

export class Item {
  uuid?: string;
  name?: string;
  owner?: string;
  item_code: string;
  item_name: string;
  qty: number;
  rate?: number;
  amount?: number;
  minimumPrice?: number;
  description?: string;
  serial_no?: string;
  delivery_note?: string;
  has_serial_no?: number;
  salesWarrantyMonths?: number;
  purchaseWarrantyMonths?: number;
  against_sales_invoice?: string;
  stock?: any;
  assigned?: number;
  remaining?: number;
  item_group?: string;
  item_defaults?: ItemDefaults;
  source_warehouse?: string;
  target_warehouse?: string;
}

export class ItemDefaults {
  name: string;
  owner: string;
  company: string;
  default_warehouse: string;
}

export class APIResponse {
  docs: any[];
  length: number;
  offset: number;
}

export interface SerialAssign {
  sales_invoice_name: string;
  set_warehouse: string;
  total_qty: number;
  total: number;
  posting_date: string;
  posting_time: string;
  customer: string;
  company: string;
  items: SerialNo[];
}

export interface SerialNo {
  item_code?: string;
  qty?: number;
  rate?: number;
  amount?: number;
  serial_no?: string[];
}
