export interface PurchaseReceiptResponseInterface {
  items: PurchaseReceiptResponseItemInterface[];
  name: string;
  status: string;
  company: string;
  supplier: string;
  doctype: string;
  total: number;
  in_words: string;
  supplier_name: string;
  title: string;
}

export interface PurchaseReceiptResponseItemInterface {
  amount: number;
  cost_center: string;
  parenttype: string;
  parent: string;
  expense_account: string;
  item_code: string;
  item_name: string;
  name: string;
  qty: number;
  rate: number;
  serial_no: string;
  warehouse: string;
}
