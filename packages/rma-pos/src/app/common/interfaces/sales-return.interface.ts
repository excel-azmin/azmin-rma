import { Item } from './sales.interface';

export interface SalesReturn {
  docstatus: number;
  customer: string;
  company: string;
  contact_email: string;
  posting_date: string;
  posting_time: string;
  is_return: boolean;
  set_warehouse: string;
  total_qty: number;
  total: number;
  items: Item[];
  credit_note_items: Item[];
  delivery_note_names: string[];
  remarks: string;
}

export interface SalesReturnDetails {
  name?: string;
  customer?: string;
  deliveryNoteName?: string;
  items?: SalesReturnItem[];
  posting_date?: string;
  territory?: string;
  set_warehouse?: string;
  instructions?: string;
}

export interface SalesReturnItem {
  item_code?: string;
  item_name?: string;
  excel_serials?: string;
  qty?: number;
  rate?: number;
  amount?: number;
  serial_no?: string;
}
