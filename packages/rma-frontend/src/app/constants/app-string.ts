export const CLOSE = 'Close';
export const SHORT_DURATION = 5000;
export const DURATION = 3000;
export const UPDATE_SUCCESSFUL = 'Update Successful';
export const UPDATE_ERROR = 'Update Error';
export const SYSTEM_MANAGER = 'System Manager';
export const USER_ROLE = 'user_roles';
export const TERRITORY = 'territory';
export const WAREHOUSES = 'warehouses';
export const DRAFT = 'Draft';
export const REJECTED = 'Rejected';
export const ACCEPT = 'Accept';
export const CONTENT_TYPE = 'Content-Type';
export const APPLICATION_JSON = 'application/json';
export const PURCHASE_RECEIPT = 'purchase_receipt';
export const DELIVERY_NOTE = 'delivery_note';
export const JSON_BODY_MAX_SIZE = 8000;
export const ASSIGN_SERIAL_DIALOG_QTY = 2;
export const MATERIAL_TRANSFER = 'Material Transfer';
export const PURCHASE_USER = 'Purchase User';
export const EXCEL_SALES_MANAGER = 'Excel Sales Manager';
export const EXCEL_SALES_USER = 'Excel Sales User';
export const EXCEL_STOCK_PRINT = 'Excel Stock Print';

export const SERVICE_INVOICE_STATUS = {
  SUBMITTED: 'Submitted',
};
export const WARRANTY_TYPE = {
  WARRANTY: 'Warranty / Non Warranty',
  NON_SERAIL: 'Non Serial Warranty',
  THIRD_PARTY: 'Third Party Warranty',
};
export const STOCK_TRANSFER_STATUS = {
  delivered: 'Delivered',
  returned: 'Returned',
  in_transit: 'In Transit',
  draft: 'Draft',
  all: 'All',
  reseted: 'Reseted',
};

export const SALES_INVOICE_STATUS = {
  CANCELED: 'Canceled',
  REJECTED: 'Rejected',
};
export const CURRENT_STATUS_VERDICT = {
  RECEIVED_FROM_CUSTOMER: 'Received from Customer',
  TRANSFERRED: 'Transferred',
  RECEIVED_FROM_BRANCH: 'Received from Branch',
  SOLVED: 'Solved ',
  UNSOLVED: 'Unsolved',
  REJECTED: 'Rejected',
  TO_REPLACE: 'To Replace',
  WORK_IN_PROGRESS: 'Work in Progress',
};

export const INVOICE_DELIVERY_STATUS = {
  DELIVERED_TO_CUSTOMER: 'Delivered to Customer',
  KEPT_IN_WAREHOUSE: 'Kept in Warehouse',
};

export const DELIVERY_STATUS = {
  REPAIRED: 'Repaired',
  REPLACED: 'Replaced',
  UPGRADED: 'Upgraded',
  REJECTED: 'Rejected',
};
export const SERIAL_DOWNLOAD_HEADERS = [
  'serial_no',
  'item_code',
  'item_name',
  'warehouse',
];
export const CSV_FILE_TYPE = ' serials.csv';
export const ITEM_COLUMN = {
  SERIAL_NO: 'serial_no',
  ITEM: 'item',
  ITEM_NAME: 'item_name',
  ITEM_CODE: 'item_code',
  QUANTITY: 'quantity',
  RATE: 'rate',
  WAREHOUSE: 'warehouse',
};

export const STOCK_ENTRY_STATUS = {
  REPLACE: 'Replace',
  UPGRADE: 'Upgrade',
};

export const STOCK_ENTRY_TYPE = {
  MATERIAL_TRANSFER: 'Material Transfer',
  MATERIAL_RECEIPT: 'Material Receipt',
  MATERIAL_ISSUE: 'Material Issue',
  RnD_PRODUCTS: 'R&D Products',
};

export const MATERIAL_TRANSFER_DISPLAYED_COLUMNS = [
  's_warehouse',
  't_warehouse',
  'item_name',
  'qty',
  'serial_no',
  'delete',
];
export const DELIVERED_SERIALS_DATE_FIELDS = ['purchasedOn', 'soldOn'];
export const DELIVERED_SERIALS_BY = {
  sales_invoice_name: 'sales_invoice_name',
  purchase_invoice_name: 'purchase_invoice_name',
  stock_entry_uuid: 'stock_entry_uuid',
};
export const NON_SERIAL_ITEM = 'Non serial Item';

export const STOCK_AVAILABILITY_CSV_FILE = 'stock_availability.csv';

export const STOCK_AVAILABILITY_DOWNLOAD_HEADERS = [
  'item_name',
  'item_code',
  'item_group',
  'brand',
  'warehouse',
  'stockAvailability',
];
