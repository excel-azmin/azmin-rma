export interface SerialSearchFields {
  purchase_document_no?: string;
  delivery_note?: string;
  customer?: string;
  customer_name?: string;
  item_name?: string;
  supplier?: string;
  serial_no?: { $regex: string; $options: string };
  item_code?: string;
  warehouse?: string;
  purchase_invoice_name?: { $exists: boolean };
  sales_invoice_name?: { $exists: boolean };
}
