import { DeliveryNoteItemInterface } from '../../sales-ui/view-sales-invoice/serials/serials-datasource';

export class SalesInvoice {
  uuid: string;
  customer: string;
  company: string;
  addressDisplay: string;
  total: number;
  items: Array<Item>;
  sales_team: Array<any>;
  createdBy: string;
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
  serial_no?: string[];
  delivery_note?: string;
  has_serial_no?: number;
  salesWarrantyMonths?: number;
  purchaseWarrantyMonths?: number;
  against_sales_invoice?: string;
  stock?: any;
  expense_account?: string;
  available_stock?: number;
  has_bundle_item?: boolean;
  bundle_items?: any[];
  assigned?: number;
  remaining?: number;
  is_stock_item?: number;
  item_group?: string;
  item_defaults?: ItemDefaults;
  source_warehouse?: string;
  target_warehouse?: string;
  warranty_date?: Date;
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

export interface AggregatedDocument {
  items: DeliveryNoteItemInterface[];
  total?: number;
  total_qty?: number;
  sales_person?: string;
  created_by?: string;
}
