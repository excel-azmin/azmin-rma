export const DIRECT_PROFILE_ENDPOINT = '/api/direct/v1/profile';
export const LIST_ITEMS_ENDPOINT = 'api/item/v1/list';
export const RELAY_LIST_COMPANIES_ENDPOINT =
  '/api/settings/v1/relay_list_companies';
export const GET_GLOBAL_DEFAULTS_ENDPOINT =
  '/api/settings/v1/relay_get_defaults';
export const LIST_WAREHOUSE_ENDPOINT =
  'api/delivery_note/v1/relay_list_warehouses';
export const GET_USER_PROFILE_ROLES = '/api/settings/v1/profile';
export const LIST_CUSTOMER_ENDPOINT = 'api/customer/v1/list';
export const LIST_BRAND_ENDPOINT = '/api/item/v1/brand_list';
export const GET_CUSTOMER_ENDPOINT = 'api/customer/v1/get';
export const LIST_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/list';
export const UPDATE_OUTSTANDING_AMOUNT_ENDPOINT =
  'api/sales_invoice/v1/update_outstanding_amount/';
export const SALES_INVOICE_GET_ONE_ENDPOINT = '/api/sales_invoice/v1/get/';
export const CREATE_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/create';
export const UPDATE_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/update';
export const SUBMIT_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/submit';
export const CANCEL_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/cancel';
export const CREATE_SALES_RETURN_ENDPOINT =
  'api/sales_invoice/v1/create_return';
export const GET_SETTINGS_ENDPOINT = '/api/settings/v1/get';
export const UPDATE_SETTINGS_ENDPOINT = '/api/settings/v1/update';
export const LIST_SERIAL_ENDPOINT = 'api/serial_no/v1/list';
export const GET_SERIAL_ENDPOINT = 'api/serial_no/v1/get';
export const ASSIGN_SERIAL_ENDPOINT = '/api/serial_no/v1/assign';
export const VIEW_SALES_INVOICE_PAGE_URL = 'view-sales-invoice';
export const ADD_SALES_INVOICE_PAGE_URL = 'add-sales-invoice';
export const RELAY_LIST_PRICE_LIST_ENDPOINT =
  '/api/command/user/api/resource/Price%20List';
export const RELAY_LIST_BRANCH_ENDPOINT =
  '/api/command/user/api/resource/Branch';
export const RELAY_GET_ITEM_PRICE_ENDPOINT =
  '/api/command/user/api/resource/Item Price';
export const RELAY_GET_DELIVERY_NOTE_ENDPOINT =
  '/api/command/user/api/resource/Delivery Note';
export const RELAY_GET_STOCK_BALANCE_ENDPOINT =
  '/api/command/user/api/method/erpnext.stock.utils.get_stock_balance';
export const RELAY_GET_ADDRESS_NAME_METHOD_ENDPOINT =
  '/api/command/user/api/method/frappe.contacts.doctype.address.address.get_default_address';
export const RELAY_GET_FULL_ADDRESS_ENDPOINT =
  '/api/command/user/api/resource/Address/';
export const RELAY_LIST_TERRITORIES_ENDPOINT =
  '/api/command/user/api/resource/Territory';
export const RELAY_LIST_SALES_RETURN_ENDPOINT =
  '/api/command/user/api/resource/Sales Invoice';
export const LIST_TERRITORIES_ENDPOINT = '/api/territory/v1/list';
export const CREATE_TERRITORY_ENDPOINT = '/api/territory/v1/create';
export const UPDATE_TERRITORY_ENDPOINT = '/api/territory/v1/update';
export const DELETE_TERRITORY_ENDPOINT = '/api/territory/v1/remove';
export const API_TERRITORY_GET_WAREHOUSES =
  '/api/territory/v1/get_warehouses_for_territories';
export const LIST_RETURN_VOUCHER_ENDPOINT = 'api/return_voucher/v1/list';
export const LIST_CREDIT_NOTE_ENDPOINT = 'api/credit_note/v1/list';
export const LIST_DELIVERY_NOTE_ENDPOINT = 'api/delivery_note/v1/list';
export const API_INFO_ENDPOINT = '/api/info';
export const API_ITEM_LIST = '/api/item/v1/list';
export const API_ITEM_SET_MIN_PRICE = '/api/item/v1/set_minimum_item_price';
export const API_ITEM_GET_BY_CODE = '/api/item/v1/get_by_item_code';
export const LIST_PURCHASE_INVOICE_ENDPOINT = '/api/purchase_invoice/v1/list';
export const PURCHASE_INVOICE_GET_ONE_ENDPOINT =
  '/api/purchase_invoice/v1/get/';
export const CREATE_PURCHASE_RECEIPT_BULK_ENDPOINT =
  '/api/purchase_receipt/v1/create_bulk';
export const CREATE_PURCHASE_RECEIPT_ENDPOINT =
  '/api/purchase_receipt/v1/create';
export const GET_TIME_ZONE =
  '/api/command/user/api/method/frappe.client.get_time_zone';
export const UPDATE_CREDIT_LIMIT_RMA_CUSTOMER_ENDPOINT =
  '/api/customer/v1/update_credit_limit';
export const UPDATE_CUSTOMER_CREDIT_LIMIT_ENDPOINT =
  '/api/command/user/api/resource/Customer%20Credit%20Limit';
export const CUSTOMER_ENDPOINT = '/api/command/user/api/resource/Customer';
export const RELAY_CUSTOMER_LIST_ENDPOINT =
  'api/customer/v1/relay_list_customer';
export const RELAY_CUSTOMER_ENDPOINT = 'api/customer/v1/relay_customer';
export const CONTACT_ENDPOINT = '/api/command/user/api/resource/Contact';
export const GET_BALANCE_ON_ENDPOINT =
  '/api/command/user/api/method/erpnext.accounts.utils.get_balance_on';
export const RELAY_API_RES_COMPANY = '/api/command/user/api/resource/Company';
export const ERPNEXT_ACCOUNT_ENDPOINT =
  '/api/command/user/api/resource/Account';
export const ERPNEXT_WAREHOUSE_ENDPOINT =
  '/api/command/user/api/resource/Warehouse';
export const API_ITEM_SET_PURCHASE_WARRANTY_DAYS =
  '/api/item/v1/set_warranty_months';
export const IS_BACKEND_CONNECTED_ENDPOINT =
  '/api/direct/v1/verify_backend_connection';
export const CONNECT_BACKEND_ENDPOINT = '/api/direct/connect';
export const LIST_WARRANTY_INVOICE_ENDPOINT = 'api/warranty_claim/v1/list';
export const VIEW_WARRANTY_INVOICE_PAGE_URL = 'view-warranty';
export const GET_SALES_INVOICE_DELIVERED_SERIALS_ENDPOINT =
  '/api/serial_no/v1/get_sales_invoice_delivered_serials';
export const GET_PURCHASE_INVOICE_DELIVERED_SERIALS_ENDPOINT =
  '/api/serial_no/v1/get_purchase_invoice_delivered_serials';
export const WARRANTY_CLAIM_GET_ONE_ENDPOINT = '/api/warranty_claim/v1/get/';
export const RESET_WARRANTY_CLAIM_ENDPOINT = '/api/warranty_claim/v1/reset';
export const REMOVE_WARRANTY_CLAIM_ENDPOINT = '/api/warranty_claim/v1/remove/';
export const STOCK_ENTRY_CREATE_ENDPOINT = '/api/stock_entry/v1/create';
export const STOCK_ENTRY_CREATE_FROM_FILE_ENDPOINT =
  '/api/stock_entry/v1/create_from_file';
export const PRINT_SALES_INVOICE_PDF_METHOD =
  '/api/method/frappe.utils.print_format.download_pdf';
export const PRINT_DELIVERY_NOTE_PDF_METHOD =
  '/api/method/frappe.utils.print_format.download_multi_pdf';
export const VALIDATE_RETURN_SERIALS =
  '/api/serial_no/v1/validate_return_serials';
export const LIST_PROBLEMS_ENDPOINT = '/api/problem/v1/list';
export const GET_PROBLEM_ENDPOINT = '/api/problem/v1/get';
export const ADD_PROBLEM_ENDPOINT = '/api/problem/v1/create';
export const UPDATE_PROBLEM_ENDPOINT = '/api/problem/v1/update';
export const DELETE_PROBLEM_ENDPOINT = '/api/problem/v1/delete';
export const JOB_QUEUE_LIST_ENDPOINT = '/api/job_queue/v1/list';
export const STOCK_BALANCE_SUMMARY_ENDPOINT = '/api/stock_ledger/v1/summary';
export const JOB_QUEUE_RETRY_ENDPOINT = '/api/job_queue/v1/retry';
export const JOB_QUEUE_RESET_ENDPOINT = '/api/job_queue/v1/reset';
export const GET_EXPORTED_JOB_ENDPOINT = '/api/job_queue/v1/get_exported_job/';
export const GET_PO_FROM_PI_NUMBER_ENDPOINT =
  '/api/purchase_order/v1/get_po_from_pi_number/';
export const GET_DOCTYPE_COUNT_METHOD =
  '/api/command/user/api/method/frappe.client.get_count';
export const CREATE_SERVICE_INVOICE_ENDPOINT = 'api/service_invoice/v1/create';
export const GET_DIRECT_SERIAL_ENDPOINT = '/api/serial_no/v1/get_direct_serial';
export const GET_SERIAL_HISTORY_ENDPOINT = '/api/serial_no/v1/get_history';
export const GET_ITEM_BY_ITEM_CODE_ENDPOINT = '/api/item/v1/get_by_item_code';
export const CREATE_WARRANTY_CLAIM_ENDPOINT = 'api/warranty_claim/v1/create';
export const UPDATE_WARRANTY_CLAIM_ENDPOINT = 'api/warranty_claim/v1/update';
export const CREATE_BULK_WARRANTY_CLAIM_ENDPOINT =
  'api/warranty_claim/v1/create_bulk';
export const RELAY_GET_FULL_ITEM_ENDPOINT =
  '/api/command/user/api/resource/Item';
export const RELAY_GET_ITEM_STOCK_ENDPOINT =
  '/api/command/user/api/resource/Bin';
export const ADD_STATUS_HISTORY_ENDPOINT =
  '/api/warranty_claim/v1/add_status_history';
export const REMOVE_STATUS_HISTORY_ENDPOINT =
  '/api/warranty_claim/v1/remove_status_history';
export const CREATE_WARRANTY_STOCK_ENTRY =
  '/api/stock_entry/v1/create_warranty_stock';
export const LIST_SERVICE_INVOICE_ENDPOINT = 'api/service_invoice/v1/list';
export const RELAY_LIST_ACCOUNT_ENDPOINT =
  '/api/command/user/api/resource/Account';
export const RELAY_LIST_PRINT_FORMAT_ENDPOINT =
  '/api/command/user/api/resource/Print%20Format';
export const RELAY_LIST_ADDRESS_ENDPOINT =
  '/api/command/user/api/resource/Address';
export const GET_TERRITORY_BY_WAREHOUSE_ENDPOINT =
  '/api/territory/v1/get_territory_by_warehouse';
export const CANCEL_STOCK_ENTRY_ENDPOINT =
  '/api/stock_entry/v1/cancel_warranty_stock_entry';
export const SUBMIT_SERVICE_INVOICE_ENDPOINT = 'api/service_invoice/v1/submit';
export const RETURN_DELIVERY_NOTE_STOCK_ENTRY_ENDPOINT =
  '/api/stock_entry/v1/create_return';
export const SERIAL_LIST_API = '/api/serial_no/v1/list';
export const RELAY_DOCTYPE_ENDPOINT_PREFIX = '/api/command/user/api/resource/';
export const GET_LIST_PROBLEM_ENDPOINT = '/api/problem/v1/list';
export const PRINT_DELIVERY_INVOICE_ENDPOINT = 'api/print/v1/delivery_invoice';
export const SYNC_WARRANTY_INVOICE_ENDPOINT =
  'api/warranty_claim/v1/sync_warranty_document';
export const FINALIZE_WARRANTY_STOCK_ENTRY =
  '/api/stock_entry/v1/finalize_warranty_stock';
export const UPDATE_DOCSTATUS_ENDPOINT =
  'api/service_invoice/v1/sync_with_ERP/';
export const LOAD_FRAPPE_DOCUMENT_METHOD_ENDPOINT =
  '/api/command/user/api/method/frappe.desk.form.load.getdoc';

export const INVOICE_LIST = '/api/serial_no/v1/invoicelist';
