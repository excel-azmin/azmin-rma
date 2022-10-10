import { Item } from './sales.interface';

export class PurchaseInvoice {
  uuid: string;
  status: string;
  supplier: string;
  total: number;
  items?: Array<Item>;
}

export class PurchaseOrder {
  uuid: string;
  name: string;
}

export class PurchaseInvoiceDetails {
  uuid?: string;
  name?: string;
  naming_series?: string;
  supplier: string;
  company: string;
  due_date: string;
  posting_date: string;
  posting_time?: string;
  address_display: string;
  buying_price_list?: string;
  total_qty?: number;
  total?: number;
  outstanding_amount?: number;
  status: string;
  submitted?: string;
  update_stock?: number;
  base_total?: number;
  net_total?: number;
  items?: Item[];
  contact_display?: string;
  purchase_receipt_items: any[];
  purchase_receipt_items_map?: any;
  purchase_receipt_names?: string[];
}
