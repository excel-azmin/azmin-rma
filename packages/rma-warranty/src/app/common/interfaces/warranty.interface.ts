import { Time } from '@angular/common';

export class WarrantyClaims {
  uuid: string;
  customer: string;
  company: string;
  addressDisplay: string;
  total: number;
  items: Array<WarrantyItem>;
  claim_no: number;
  claim_status: string;
}

export class WarrantyItem {
  customer?: string;
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
  against_sales_invoice?: string;
  stock?: any;
  assigned?: number;
  remaining?: number;
  item_group?: string;
  brand?: string;
  item_defaults?: ItemDefaults;
  s_warehouse?: string;
  t_warehouse?: string;
  has_serial_no?: number;
  stock_entry_type?: string;
  warehouse?: string;
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
  item_code: string;
  qty: number;
  rate: number;
  amount: number;
  serial_no: string[];
}

export interface WarrantyClaimsDetails {
  warranty_end_date: Date;
  claim_type: string;
  received_on: Date;
  delivery_date: Date;
  receiving_branch: string;
  delivery_branch: string;
  address_display: string;
  received_by: string;
  delivered_by: string;
  serial_no: string;
  invoice_no: string;
  item_name: string;
  product_brand: string;
  problem: string;
  problem_details: string;
  remarks: string;
  customer: string;
  customer_contact: string;
  customer_address: string;
  third_party_name: string;
  third_party_contact: string;
  third_party_address: string;
  item_code: string;
  warranty_claim_date: Date;
  status_history?: StatusHistoryDetails[];
  posting_time: Date;
  uuid?: string;
  category?: string;
  set?: string;
  bulk_products: WarrantyBulkProducts[];
  replace_serial: string;
  replace_product: string;
  replace_warehouse: string;
  damaged_serial: string;
  damage_warehouse: string;
  damage_product: string;
  parent?: string;
  claim_status?: string;
  customer_code?: string;
  outstanding_amount?: number;
  claim_no?: string;
  service_vouchers?: string[];
  print?: any;
  progress_state: StockEntryDetails[];
  subclaim_state: string;
}

export class WarrantyBulkProducts {
  serial_no?: string;
  claim_type?: string;
  invoice_no?: string;
  warranty_end_date?: string;
  item_name?: string;
  product_brand?: string;
  problem?: string;
  problem_details?: string;
  remarks?: string;
  item_code?: string;
  customer_contact?: string;
  customer_address?: string;
  customer_name?: string;
  third_party_name?: string;
  third_party_contact?: string;
  third_party_address?: string;
  received_by?: string;
  delivered_by?: string;
  customer?: string;
  customer_code?: string;
  warranty_claim_date?: string;
  received_on?: Date;
  delivery_date?: Date;
  receiving_branch?: string;
  delivery_branch?: string;
}

export class WarrantyState {
  serial_no: { disabled: boolean; active: boolean };
  invoice_no: { disabled: boolean; active: boolean };
  warranty_end_date: { disabled: boolean; active: boolean };
  customer_contact: { disabled: boolean; active: boolean };
  customer_address: { disabled: boolean; active: boolean };
  product_name: { disabled: boolean; active: boolean };
  customer_name: { disabled: boolean; active: boolean };
  product_brand: { disabled: boolean; active: boolean };
  third_party_name: { disabled: boolean; active: boolean };
  third_party_contact: { disabled: boolean; active: boolean };
  third_party_address: { disabled: boolean; active: boolean };
  category: { disabled: boolean; active: boolean };
}

export class Warranty {
  purchaseWarrantyDate: string;
  salesWarrantyDate: Date;
  purchasedOn: Date;
  soldOn: Date;
}
export class QueueState {
  purchase_receipt: {
    parent: string;
    warehouse: string;
  };
  delivery_note: {
    parent: string;
    warehouse: string;
  };
  stock_entry: {
    parent: string;
    source_warehouse: string;
    target_warehouse: string;
  };
}

export class SerialNoDetails {
  uuid?: string;
  isSynced?: boolean;
  warranty_expiry_date?: string;
  modified?: boolean;
  name?: string;
  owner?: string;
  creation?: string;
  sales_invoice_name?: string;
  serial_no?: string;
  item_code?: string;
  item_name?: string;
  description?: string;
  item_group?: string;
  purchase_time?: string;
  purchase_rate?: number;
  supplier?: string;
  customer?: string;
  warehouse?: string;
  delivery_note?: string;
  purchase_document_no?: string;
  sales_return_name?: string;
  sales_document_no?: string;
  purchase_document_type?: string;
  company?: string;
  warranty?: Warranty;
  purchase_date?: string;
  queue_state?: QueueState;
  purchase_invoice_name?: string;
  brand?: string;
  claim_no?: string;
}

export class StatusHistoryDetails {
  uuid?: string;
  posting_date?: Date;
  time?: Time;
  status_from?: string;
  transfer_branch?: string;
  verdict?: string;
  description?: string;
  delivery_status?: string;
  status?: string;
  delivery_branch?: string;
  date: Date;
  claim_status?: string;
}

export class StockEntryDetails {
  company?: string;
  warrantyClaimUuid?: string;
  stock_entry_type?: string;
  posting_date?: string;
  posting_time?: string;
  doctype?: string;
  type?: string;
  description?: string;
  customer?: string;
  stock_voucher_number?: string;
  salesWarrantyDate?: string;
  soldOn?: string;
  delivery_note?: string;
  sales_invoice_name?: string;
  items?: StockItem[];
  set_warehouse?: string;
  is_return?: number;
  naming_series?: string;
}

export class StockItem {
  s_warehouse?: string;
  t_warehouse?: string;
  transferWarehouse?: string;
  item_code?: string;
  item_name?: string;
  qty?: number;
  serial_no?: string;
  has_serial_no?: number;
  excel_serials?: string;
  warranty?: any;
}

export class StockEntryItems {
  uuid?: string;
  name?: string;
  owner?: string;
  item_code?: string;
  item_name?: string;
  qty?: number;
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
  s_warehouse?: string;
  t_warehouse?: string;
  warehouse?: string;
  type?: string;
  stock_entry_type?: string;
}

export interface WarrantyPrintDetails {
  name: string;
  third_party_name: string;
  third_party_contact: string;
  third_party_address: string;
  customer: string;
  customer_contact: string;
  customer_address: string;
  remarks: string;
  claim_no: string;
  received_on: string;
  delivery_date: string;
  receiving_branch: string;
  problem_details: string;
  delivered_by: string;
  received_by: string;
  items: string;
  s_warehouse: string;
  t_warehouse: string;
  tc_details: string;
  select_print_heading: string;
  warranty_invoices: string;
  footer: string;
  problem: string;
  uuid?: string;
  replace_serial: string;
  replace_product: string;
  replace_warehouse: string;
  claim_status?: string;
  status_history?: string;
  progress_state?: string;
  completed_delivery_note?: string;
  damage?: string;
  set?: string;
  service_vouchers?: string;
  damaged_serial?: string;
  damage_warehouse?: string;
  damage_product?: string;
  category?: string;
  service_items?: string;
  delivery_status?: string;
  bulk_products?: WarrantyBulkProducts[];
  print_type?: string;
  delivery_notes?: string;
  posting_time?: Date;
  warranty_end_date?: string;
  bulk_invoices?: string;
}

export class PrintDeliveryNotes {
  item_name?: string;
  serial_no?: string;
  voucher_number?: string;
  warranty_end_date?: string;
  set_warehouse?: string;
  description?: string;
}

export class WarrantyVouchers {
  voucher_number: string;
  amount: number;
  paid: number;
  unpaid: number;
}
export class WarrantyPrintItems {
  item_name: string;
  serial_no: string;
  warranty_end_date: Date;
}

export interface serviceInvoicePrintData {
  voucher_number: string;
  description: string;
  amount: number;
  paid: number;
  unpaid: number;
}
