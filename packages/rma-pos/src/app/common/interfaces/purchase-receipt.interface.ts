export interface PurchaseReceipt {
  purchase_invoice_name: string;
  naming_series: string;
  supplier: string;
  posting_date: string;
  posting_time: string;
  company: string;
  total_qty: number;
  total: number;
  items: PurchaseReceiptItem[];
}

export interface PurchaseReceiptItem {
  item_code: string;
  item_name: string;
  warehouse: string;
  serial_no: string[];
  has_serial_no: number;
  warranty_date: string;
  qty: number;
  rate: number;
  amount: number;
}
