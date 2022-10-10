export const CLOSE = 'Close';
export const SHORT_DURATION = 5000;
export const DURATION = 1000;
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
export const MATERIAL_TRANSFER = 'Material Transfer';
export const MATERIAL_ISSUE = 'Material Issue';
export const MATERIAL_RECEIPT = 'Material Receipt';
export const PURCHASE_USER = 'Purchase User';
export const EXCEL_SALES_MANAGER = 'Excel Sales Manager';
export const EXCEL_SALES_USER = 'Excel Sales User';
export const EXCEL_WARRANTY_PRINT = 'Excel Warranty Print';
export const SUBMIT_STATUS = {
  SUBMITTED: 'Submitted',
  NOT_SUBMITTED: 'Not Submitted',
  CANCELED: 'Canceled',
  NOT_AVAILABLE: 'Status not available',
};
export const SERVICE_INVOICE_STATUS = {
  SUBMITTED: 'Submitted',
  PAID: 'Paid',
  UNPAID: 'Unpaid',
  ALL: 'All',
};
export const SERIAL_DOWNLOAD_HEADERS = [
  'serial_no',
  'item_code',
  'item_name',
  'warehouse',
];
export const WARRANTY_CLAIMS_DOWNLOAD_HEADERS = [
  'claim_no',
  'claim_type',
  'received_date',
  'customer_third_party',
  'customer_name',
  'third_party_name',
  'item_code',
  'claimed_serial',
  'claim_status',
  'receiving_branch',
  'delivery_branch',
  'received_by',
  'delivered_by',
  'product_brand',
  'received_serial',
  'replaced_serial',
  'problem',
  'verdict',
  'delivery_date',
  'billed_amount',
  'outstanding_amount',
  'remarks',
];
export const WARRANTY_CLAIMS_CSV_FILE = 'warranty-claim-list.csv';
export const CSV_FILE_TYPE = ' serials.csv';
export const WARRANTY_TYPE = {
  WARRANTY: 'Warranty',
  NON_WARRANTY: 'Non Warranty',
  NON_SERIAL: 'Non Serial Warranty',
  THIRD_PARTY: 'Third Party Warranty',
};

export const CURRENT_STATUS_VERDICT = {
  RECEIVED_FROM_BRANCH: 'Received from Branch',
  WORK_IN_PROGRESS: 'Work in Progress',
  SENT_TO_ENG_DEPT: 'Sent to Eng. Dept',
  SENT_TO_REPAIR_DEPT: 'Sent to Repair Dept',
  TRANSFERRED: 'Transferred',
  SOLVED: 'Solved - Repairing done',
  TO_REPLACE: 'Unsolved - To Replace',
  UNSOLVED: 'Unsolved - Return to Owner',
  DELIVER_TO_CUSTOMER: 'Deliver to Customer',
};

export const DELIVERY_STATUS = {
  REPAIRED: 'Repaired',
  REPLACED: 'Replaced',
  UPGRADED: 'Upgraded',
  REJECTED: 'Rejected',
};

export const ITEM_COLUMN = {
  SERIAL_NO: 'serial_no',
  ITEM: 'item',
  ITEM_NAME: 'item_name',
  ITEM_CODE: 'item_code',
  QUANTITY: 'quantity',
  RATE: 'rate',
  WAREHOUSE: 'warehouse',
  STOCK_ENTRY_ITEM_TYPE: 'stock_entry_type',
};

export const STOCK_ENTRY_STATUS = {
  REPLACE: 'Replace',
  UPGRADE: 'Upgrade',
  SPARE_PARTS: 'Spare Parts',
};
export const STOCK_ENTRY_ITEM_TYPE = {
  RETURNED: 'Returned',
  DELIVERED: 'Delivered',
};

export enum CLAIM_STATUS {
  IN_PROGRESS = 'In Progress',
  TO_DELIVER = 'To Deliver',
  DELIVERED = 'Delivered',
  UNSOLVED = 'Unsolved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
  ALL = 'All',
}

export enum CATEGORY {
  BULK = 'Bulk',
  SINGLE = 'Single',
  PART = 'Part',
}

export const SERVICE_INVOICE_DOWNLOAD_HEADERS = [
  'customer_name',
  'date',
  'total',
];

export enum SORT_ORDER {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC',
}

export enum DATE_TYPE {
  RECEIVED_DATE = 'Received Date',
  DELIVERED_DATE = 'Delivery Date',
}

export const SERVICE_INVOICE_CSV_FILE = 'service-invoice-list.csv';
export const DELIVERY_TOKEN = 'Delivery Token';
export const SERVICE_TOKEN = 'Service Token';
