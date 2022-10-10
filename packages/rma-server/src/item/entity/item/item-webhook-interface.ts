export interface BarcodesInterface {
  name: string;
  idx: number;
  docstatus: number;
  barcode: string;
  barcode_type: string;
}

export interface UomInterface {
  name: string;
  idx: number;
  docstatus: number;
  conversion_factor: number;
  uom: string;
  doctype: string;
}
export interface ItemDefaultsInterface {
  company: string;
  default_warehouse: string;
  doctype: string;
}

export interface ItemWebhookInterface {
  creation: string;
  modified: string;
  name: string;
  owner: string;
  modified_by: string;
  docstatus: number;
  item_code: string;
  item_name: string;
  item_group: string;
  stock_uom: string;
  disabled: number;
  description: string;
  shelf_life_in_days: number;
  end_of_life: string;
  default_material_request_type: string;
  has_variants: number;
  has_serial_no: number;
  is_purchase_item: number;
  min_order_qty: number;
  safety_stock: number;
  last_purchase_rate: number;
  country_of_origin: string;
  is_sales_item: number;
  isSynced?: boolean;
  brand?: string;
}

export interface ItemApiResponseInterface {
  creation: string;
  modified: string;
  name: string;
  owner: string;
  modified_by: string;
  docstatus: number;
  item_code: string;
  item_name: string;
  item_group: string;
  stock_uom: string;
  disabled: number;
  description: string;
  shelf_life_in_days: number;
  end_of_life: string;
  default_material_request_type: string;
  has_serial_no: number;
  has_variants: number;
  is_purchase_item: number;
  min_order_qty: number;
  safety_stock: number;
  last_purchase_rate: number;
  country_of_origin: string;
  is_sales_item: number;
  barcodes: BarcodesInterface[];
  uoms: UomInterface[];
  attributes: any[];
  item_defaults: ItemDefaultsInterface[];
  taxes: any[];
  brand?: string;
  excel_serials: string;
}

export interface ItemBundleWebhookInterface {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  new_item_code: string;
  items: ItemBundleItemWebhookInterface[];
}

export interface ItemBundleItemWebhookInterface {
  parent: string;
  parentfield: string;
  parenttype: string;
  item_code: string;
  item_name?: string;
  description: string;
  qty: number;
  rate: number;
  uom: string;
  excel_serials: string;
}
