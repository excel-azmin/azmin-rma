export interface CreateDeliveryNoteInterface {
  docstatus?: number;
  customer?: string;
  company?: string;
  posting_date?: string;
  posting_time?: string;
  status?: string;
  is_return?: boolean;
  naming_series?: string;
  issue_credit_note?: boolean;
  return_against?: string;
  set_warehouse?: string;
  contact_email?: string;
  doctype?: string;
  selling_price_list?: string;
  price_list_currency?: string;
  plc_conversion_rate?: number;
  total_qty?: number;
  total?: number;
  items?: CreateDeliveryNoteItemInterface[];
  pricing_rules?: any[];
  packed_items?: any[];
  taxes?: any[];
  sales_team?: any[];
}

export interface CreateDeliveryNoteItemInterface {
  item_code: string;
  qty?: number;
  rate?: number;
  amount?: number;
  excel_serials?: string;
  has_serial_no: number;
  warranty_date?: string;
  against_sales_invoice?: string;
  serial_no?: any;
  cost_center?: string;
}
