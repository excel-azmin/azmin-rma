export const ADMINISTRATOR = 'administrator';
export const SYSTEM_MANAGER = 'System Manager';
export const TOKEN = 'token';
export const AUTHORIZATION = 'authorization';
export const SERVICE = 'rma-server';
export const PUBLIC = 'public';
export const APP_NAME = 'rma-server';
export const SWAGGER_ROUTE = 'api-docs';
export enum ConnectedServices {
  CommunicationServer = 'communication-server',
  InfrastructureConsole = 'infrastructure-console',
  IdentityProvider = 'identity-provider',
}
export const BEARER_HEADER_VALUE_PREFIX = 'Bearer ';
export const APPLICATION_JSON_CONTENT_TYPE = 'application/json';
export const CONTENT_TYPE_HEADER_KEY = 'Content-Type';
export const GLOBAL_API_PREFIX = 'api';
export const PASSWORD = 'password';
export const REFRESH_TOKEN = 'refresh_token';
export const OPENID = 'openid';
export const CONTENT_TYPE = 'content-type';
export const APP_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded';
export const APP_JSON = 'application/json';
export const TEN_MINUTES_IN_SECONDS = 600;
export const REDIRECT_ENDPOINT = '/api/direct/callback';
export const PROFILE_ENDPOINT =
  '/api/method/frappe.integrations.oauth2.openid_profile';
export const AUTH_ENDPOINT = '/api/method/frappe.integrations.oauth2.authorize';
export const REVOKE_ENDPOINT =
  '/api/method/frappe.integrations.oauth2.revoke_token';
export const TOKEN_ENDPOINT =
  '/api/method/frappe.integrations.oauth2.get_token';
export const TWENTY_MINUTES_IN_SECONDS = 1200; // 20 * 60; // 20 min * 60 sec;
export const SCOPE = 'all openid';
export const ACTIVE = 'Active';
export const REVOKED = 'Revoked';
export const CUSTOMER_ALREADY_EXISTS = 'Customer already exists';
export const ITEM_ALREADY_EXISTS = 'Item already exists';
export const SUPPLIER_ALREADY_EXISTS = 'Supplier already exists';
export const ACCEPT = 'Accept';
export const ITEM_METADATA_FILTER_FIELDS = [
  'creation',
  'modified',
  'modified_by',
  'parent',
  'parentfield',
  'parenttype',
];
export const NONE_PYTHON_STRING = 'None';
export const HUNDRED_NUMBER_STRING = '100';
export const DELIVERY_NOTE_LIST_FIELD = [
  'name',
  'title',
  'status',
  'posting_date',
  'total',
  'owner',
  'modified_by',
];
export const CREDIT_NOTE_LIST_FIELD = [
  'name',
  'owner',
  'modified_by',
  'title',
  'customer_name',
  'company',
  'posting_date',
  'due_date',
  'return_against',
  'contact_email',
  'total',
];
export const RETURN_VOUCHER_LIST_FIELD = [
  'name',
  'owner',
  'modified_by',
  'payment_type',
  'posting_date',
  'company',
  'mode_of_payment',
  'party_type',
  'party',
  'party_balance',
  'paid_amount',
];
export const INVALID_FILE =
  'Provided file is invalid please provide a JSON file with type claims : claim[]';
export const FILE_NOT_FOUND =
  'File is missing, please provide your claims file';
export const DRAFT_STATUS = 'Draft';
export const TO_DELIVER_STATUS = 'To Deliver';
export const REJECTED_STATUS = 'Rejected';
export const SUBMITTED_STATUS = 'Submitted';
export const CANCELED_STATUS = 'Canceled';
export const COMPLETED_STATUS = 'Completed';
export const SALES_INVOICE_STATUS = {
  deliver: TO_DELIVER_STATUS,
  rejected: REJECTED_STATUS,
  draft: DRAFT_STATUS,
  submitted: SUBMITTED_STATUS,
  completed: COMPLETED_STATUS,
  canceled: CANCELED_STATUS,
};
export const CANCEL_WARRANTY_STOCK_ENTRY = 'CANCEL';
export const STOCK_ENTRY_STATUS = {
  in_transit: 'In Transit',
  delivered: 'Delivered',
  returned: 'Returned',
  reseted: 'Reseted',
  draft: 'Draft',
};
export const INVOICE_DELIVERY_STATUS = {
  DELIVERED_TO_CUSTOMER: 'Delivered to Customer',
  KEPT_IN_WAREHOUSE: 'Kept in Warehouse',
};
export const SALES_USER = 'Sales User';
export const SALES_MANAGER = 'Sales Manager';
export const SALES_INVOICE_STATUS_ENUM = [
  'Draft',
  'To Deliver',
  'Rejected',
  'Submitted',
];
export const WARRANTY_CLAIM_DOCTYPE = 'Warranty Claim';
export const PURCHASE_RECEIPT = 'purchase_receipt';
export const DELIVERY_NOTE = 'delivery_note';
export const DELIVERY_NOTE_DOCTYPE = 'Delivery Note';
export const STOCK_ENTRY_SERIALS_BATCH_SIZE = 6000;
export const DELIVERY_NOTE_SERIAL_BATCH_SIZE = 6000;
export const SERIAL_NO_VALIDATION_BATCH_SIZE = 10000;
export const ITEM_SYNC_BUFFER_COUNT = 30;
export const FRAPPE_INSERT_MANY_BATCH_COUNT = 2;
export const PURCHASE_RECEIPT_DOCTYPE_NAME = 'Purchase Receipt';
export const SERIAL_NO_DOCTYPE_NAME = 'Serial No';
export const MONGO_INSERT_MANY_BATCH_NUMBER = 10000;
export const VALIDATE_AUTH_STRING = 'validate_oauth';
export const TOKEN_HEADER_VALUE_PREFIX = 'token ';
export const STOCK_MATERIAL_TRANSFER = 'Material Transfer';
export const STOCK_ENTRY = 'Stock Entry';
export const ITEM_DOCTYPE = 'Item';
export const SALES_INVOICE_DOCTYPE = 'Sales Invoice';
export const FRAPPE_QUEUE_JOB = 'FRAPPE_QUEUE_JOB';
export const FRAPPE_SYNC_DATA_IMPORT_QUEUE_JOB =
  'FRAPPE_SYNC_DATA_IMPORT_QUEUE_JOB';
export const CREATE_DELIVERY_NOTE_JOB = 'CREATE_DELIVERY_NOTE_JOB';
export const STOCK_ENTRY_LIST_ITEM_SELECT_KEYS = [
  's_warehouse',
  't_warehouse',
  'item_code',
  'item_name',
  'qty',
  'transfer_qty',
  'transferWarehouse',
  'serial_no',
  'stock_id',
];
// following fields would be listed in API for job_queue/v1/list.
export const FRAPPE_JOB_SELECT_FIELDS = [
  'name',
  'failedAt',
  'failCount',
  'failReason',
  'data.status',
  'data.parent',
  'data.payload',
  'data.token.fullName',
  'data.sales_invoice_name',
  'data.uuid',
  'data.type',
];
export const AGENDA_JOB_STATUS = {
  success: 'Successful',
  fail: 'Failed',
  in_queue: 'In Queue',
  reset: 'Reset',
  retrying: 'Retrying',
  exported: 'Exported',
};
export const SERIAL_WAREHOUSE_STATUS = {
  sold: 'Sold to customer.',
};
export const AGENDA_MAX_RETRIES = 1;
export const AGENDA_DATA_IMPORT_MAX_RETRIES = 2;
export const FRAPPE_DATA_IMPORT_INSERT_ACTION = 'Insert new records';
export const SYNC_DELIVERY_NOTE_JOB = 'SYNC_DELIVERY_NOTE_JOB';
export enum WARRANTY_TYPE {
  WARRANTY = 'Warranty',
  NON_WARRANTY = 'Non Warranty',
  NON_SERIAL = 'Non Serial Warranty',
  THIRD_PARTY = 'Third Party Warranty',
}
export enum WARRANTY_STATUS {
  VALID = 'Valid',
  EXPIRED = 'Expired',
}
export const CLAIM_CANCEL_DOCUMENT = 'Claim Cannot be Cancelled';
export const PURCHASE_RECEIPT_SERIALS_BATCH_SIZE = 20000;
// changing PURCHASE_RECEIPT_INSERT_MANY_BATCH_COUNT would require change's in data import,
// make sure to handle them before changing this.
export const PURCHASE_RECEIPT_INSERT_MANY_BATCH_COUNT = 1;
export const ONE_MINUTE_IN_MILLISECONDS = 60000;
export const DATA_IMPORT_DELAY = 1339;
export const SYNC_PURCHASE_RECEIPT_JOB = 'SYNC_PURCHASE_RECEIPT_JOB';
export const DEFAULT_CURRENCY = 'BDT';
// export const DEFAULT_CURRENCY = 'INR';console.log('unComment IT local testing');
export const DEFAULT_NAMING_SERIES = {
  sales_order: 'SO-.YYYY.-',
  sales_invoice: 'SINV-.YYYY.-',
  delivery_note: 'SD-.YYYY.-',
  warranty_delivery_note: 'WSD-.YYYY.-',
  sales_return: 'RINV-.YYYY.-',
  delivery_return: 'SDR-.YYYY.-',
  warranty_delivery_return: 'WSDR-.YYYY.-',
  purchase_order: 'PO-.YYYY.-',
  purchase_invoice: 'PINV-.YYYY.-',
  purchase_receipt: 'PD-.YYYY.-',
  stock_send: 'TROUT-.YYYY.-',
  stock_receive: 'TRIN-.YYYY.-',
  stock_rejected: 'BTRIN-.YYYY.-',
  material_receipt: 'PAQ-.YYYY.-',
  material_issue: 'PCM-.YYYY.-',
  rnd_products: 'RND-.YYYY.-',
  stock_transfer_internal: 'TRO-.YYYY.-',
  warranty_claim: 'RMA-',
  bulk_warranty_claim: 'BRMA-',
  service_invoice: 'WINV-.YYYY.-',
};
export const MAX_SERIAL_BODY_COUNT = 100000;
export enum VERDICT {
  RECEIVED_FROM_CUSTOMER = 'Received from Customer',
  RECEIVED_FROM_BRANCH = 'Received from Branch',
  WORK_IN_PROGRESS = 'Work in Progress',
  SENT_TO_ENG_DEPT = 'Sent to Eng. Dept',
  SENT_TO_REPAIR_DEPT = 'Sent to Repair Dept',
  TRANSFERRED = 'Transferred',
  SOLVED = 'Solved - Repairing done',
  TO_REPLACE = 'Unsolved - To Replace',
  UNSOLVED = 'Unsolved - Return to Owner',
  DELIVER_TO_CUSTOMER = 'Deliver to Customer',
}
export const ALL_TERRITORIES = 'All Territories';
export const MULTIPART_FORM_DATA = 'multipart/form-data';
export const PURCHASE_RECEIPT_DOCTYPE_NAMES = [
  PURCHASE_RECEIPT_DOCTYPE_NAME,
  'Purchase%20Receipt',
];
export const DELIVERY_NOTE_DOCTYPE_NAMES = [
  DELIVERY_NOTE_DOCTYPE,
  'Delivery%20Note',
];
export const UNSET = 'UNSET';
export enum CLAIM_STATUS {
  IN_PROGRESS = 'In Progress',
  TO_DELIVER = 'To Deliver',
  DELIVERED = 'Delivered',
  UNSOLVED = 'Unsolved',
  REJECTED = 'Rejected',
}

export enum CATEGORY {
  BULK = 'Bulk',
  SINGLE = 'Single',
  PART = 'Part',
}

export const PROGRESS_STATUS = {
  REPLACE: 'Replace',
  UPGRADE: 'Upgrade',
  SPARE_PARTS: 'Spare Parts',
};

export const DELIVERY_STATUS = {
  REPAIRED: 'Repaired',
  REPLACED: 'Replaced',
  UPGRADED: 'Upgraded',
  REJECTED: 'Rejected',
};

export const PURCHASE_INVOICE_STATUS = {
  SUBMITTED: 'Submitted',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled',
};

export const DOC_NAMES = {
  PURCHASE_ORDER: 'Purchase Order',
  PURCHASE_RECEIPT: 'Purchase Receipt',
  PURCHASE_INVOICE: 'Purchase Invoice',
  PAYMENT_ENTRY: 'Payment Entry',
  LANDED_COST_VOUCHER: 'Landed Cost Voucher',
  STOCK_ENTRY: 'Stock Entry',
  SALES_INVOICE: 'Sales Invoice',
  DELIVERY_NOTE: 'Delivery Note',
};

export const NON_SERIAL_ITEM = 'NON SERIAL ITEM';

export const DOC_RESET_INFO = {
  [DOC_NAMES.PURCHASE_ORDER]: {
    'Purchase Invoice': {
      child_doctype: 'Purchase Invoice Item',
      fieldname: ['purchase_order'],
    },
    'Purchase Receipt': {
      child_doctype: 'Purchase Receipt Item',
      fieldname: ['purchase_order'],
    },
  },
  [DOC_NAMES.PURCHASE_INVOICE]: {
    'Payment Entry': {
      child_doctype: 'Payment Entry Reference',
      fieldname: ['reference_name'],
      doctype_fieldname: 'reference_doctype',
    },
    'Landed Cost Voucher': {
      child_doctype: 'Landed Cost Purchase Receipt',
      fieldname: ['receipt_document'],
      doctype_fieldname: 'receipt_document_type',
    },
  },
  [DOC_NAMES.PURCHASE_RECEIPT]: {
    'Landed Cost Voucher': {
      child_doctype: 'Landed Cost Purchase Receipt',
      fieldname: ['receipt_document'],
      doctype_fieldname: 'receipt_document_type',
    },
  },
  [DOC_NAMES.SALES_INVOICE]: {
    'Sales Invoice': {
      fieldname: ['amended_from', 'return_against'],
    },
    'Delivery Note': {
      child_doctype: 'Delivery Note Item',
      fieldname: ['against_sales_invoice'],
    },
    'Payment Entry': {
      child_doctype: 'Payment Entry Reference',
      fieldname: ['reference_name'],
      doctype_fieldname: 'reference_doctype',
    },
  },
};

export const CREATE_STOCK_ENTRY_JOB = 'CREATE_STOCK_ENTRY_JOB';
export const ACCEPT_STOCK_ENTRY_JOB = 'ACCEPT_STOCK_ENTRY_JOB';
export const REJECT_STOCK_ENTRY_JOB = 'REJECT_STOCK_ENTRY_JOB';

export const STOCK_ENTRY_TYPE = {
  MATERIAL_TRANSFER: 'Material Transfer',
  MATERIAL_RECEIPT: 'Material Receipt',
  MATERIAL_ISSUE: 'Material Issue',
  RnD_PRODUCTS: 'R&D Products',
};
export const STOCK_ENTRY_NAMING_SERIES = {
  [CREATE_STOCK_ENTRY_JOB]: DEFAULT_NAMING_SERIES.stock_send,
  [ACCEPT_STOCK_ENTRY_JOB]: DEFAULT_NAMING_SERIES.stock_receive,
  [REJECT_STOCK_ENTRY_JOB]: DEFAULT_NAMING_SERIES.stock_rejected,
  [STOCK_ENTRY_TYPE.MATERIAL_ISSUE]: DEFAULT_NAMING_SERIES.material_issue,
  [STOCK_ENTRY_TYPE.RnD_PRODUCTS]: DEFAULT_NAMING_SERIES.rnd_products,
  [STOCK_ENTRY_TYPE.MATERIAL_RECEIPT]: DEFAULT_NAMING_SERIES.material_receipt,
};
export const INVALID_REGEX = ['+', '(', ')'];
export function PARSE_REGEX(value: string) {
  return value
    .split('')
    .map(char => {
      return INVALID_REGEX.includes(char) ? `\\${char}` : char;
    })
    .join('');
}
export const SERIAL_FILTER_KEYS = [
  'item_code',
  'warehouse',
  'serial_no',
  'sales_invoice_name',
  'purchase_invoice_name',
];
export const STOCK_ENTRY_PERMISSIONS = {
  stock_entry: {
    read: [
      'Branch Sales Manager',
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'Branch Stock Receipt Creator',
      'Branch Stock Receipt Approver',
      'Branch Stock Issue Creator',
      'Branch Stock Issue Approver',
      'Branch Stock RnD Creator',
      'Branch Stock RnD Approver',
      'Branch Sales Creator',
      'Branch Sales Approver',
      'Branch Sales Return User',
      'Item Price Manager',
      'General Admin',
    ],
    create: [
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    update: [
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    submit: [
      'Branch Stock User',
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    // This accept action needs to be added
    accept: [
      'Branch Stock Supervisor',
      'Branch Stock Manager',
      'General Admin',
    ],
    delete: ['General Admin'],
  },

  // Material Receipt
  stock_entry_receipt: {
    read: [
      'Branch Stock Receipt Creator',
      'Branch Stock Receipt Approver',
      'General Admin',
    ],
    create: [
      'Branch Stock Receipt Creator',
      'Branch Stock Receipt Approver',
      'General Admin',
    ],
    update: [
      'Branch Stock Receipt Creator',
      'Branch Stock Receipt Approver',
      'General Admin',
    ],
    submit: ['Branch Stock Receipt Approver', 'General Admin'],
    delete: ['General Admin'],
  },

  // Material Issue
  stock_entry_issue: {
    read: [
      'Branch Stock Issue Creator',
      'Branch Stock Issue Approver',
      'General Admin',
    ],
    create: [
      'Branch Stock Issue Creator',
      'Branch Stock Issue Approver',
      'General Admin',
    ],
    update: [
      'Branch Stock Issue Creator',
      'Branch Stock Issue Approver',
      'General Admin',
    ],
    submit: ['Branch Stock Issue Approver', 'General Admin'],
    delete: ['General Admin'],
  },

  // Material RnD
  stock_entry_rnd: {
    read: [
      'Branch Stock RnD Creator',
      'Branch Stock RnD Approver',
      'General Admin',
    ],
    create: [
      'Branch Stock RnD Creator',
      'Branch Stock RnD Approver',
      'General Admin',
    ],
    update: [
      'Branch Stock RnD Creator',
      'Branch Stock RnD Approver',
      'General Admin',
    ],
    submit: ['Branch Stock RnD Approver', 'General Admin'],
    delete: ['General Admin'],
  },
};
export const STOCK_OPERATION = {
  read: 'read',
  create: 'create',
  update: 'update',
  submit: 'submit',
  delete: 'delete',
  accept: 'accept',
};
export const CURRENT_STATUS_VERDICT = {
  RECEIVED_FROM_CUSTOMER: 'Received from Customer',
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
