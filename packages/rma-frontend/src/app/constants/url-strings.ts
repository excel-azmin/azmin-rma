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
export const GET_CUSTOMER_ENDPOINT = 'api/customer/v1/get';
export const LIST_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/list';
export const UPDATE_OUTSTANDING_AMOUNT_ENDPOINT =
  'api/sales_invoice/v1/update_outstanding_amount/';
export const SALES_INVOICE_GET_ONE_ENDPOINT = '/api/sales_invoice/v1/get/';
export const CREATE_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/create';
export const UPDATE_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/update';
export const UPDATE_DELIVERY_STATUS_ENDPOINT =
  'api/sales_invoice/v1/update_delivery_status';
export const UPDATE_SALES_INVOICE_ITEM_MRP =
  'api/sales_invoice/v1/update_mrp_rate';
export const SUBMIT_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/submit';
export const CANCEL_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/cancel';
export const CREATE_SALES_RETURN_ENDPOINT =
  'api/sales_invoice/v1/create_return';
export const CANCEL_SALES_RETURN_ENDPOINT =
  'api/sales_invoice/v1/cancel_return';
export const GET_SETTINGS_ENDPOINT = '/api/settings/v1/get';
export const UPDATE_SETTINGS_ENDPOINT = '/api/settings/v1/update';
export const LIST_SERIAL_ENDPOINT = 'api/serial_no/v1/list';
export const GET_SERIAL_ENDPOINT = 'api/serial_no/v1/get';
export const ASSIGN_SERIAL_ENDPOINT = '/api/serial_no/v1/assign';
export const VIEW_SALES_INVOICE_PAGE_URL = 'view-sales-invoice';
export const ADD_SALES_INVOICE_PAGE_URL = 'add-sales-invoice';
export const RELAY_LIST_PRICE_LIST_ENDPOINT =
  '/api/command/user/api/resource/Price%20List';
export const RELAY_GET_ITEM_PRICE_ENDPOINT =
  '/api/command/user/api/resource/Item Price';
export const RELAY_GET_ITEM_GROUP_ENDPOINT =
  '/api/command/user/api/resource/Item Group';
export const RELAY_GET_ITEM_BRAND_ENDPOINT =
  '/api/command/user/api/resource/Brand';
export const RELAY_GET_DELIVERY_NOTE_ENDPOINT =
  '/api/command/user/api/resource/Delivery Note';
export const RELAY_GET_STOCK_BALANCE_ENDPOINT =
  '/api/command/user/api/method/erpnext.stock.utils.get_stock_balance';
export const GET_STOCK_BALANCE_ENDPOINT =
  '/api/stock_entry/v1/get_stock_balance';
export const RELAY_GET_DATE_WISE_STOCK_BALANCE_ENDPOINT =
  '/api/command/user/api/method/erpnext.stock.doctype.quick_stock_balance.quick_stock_balance.get_stock_item_details';
export const RELAY_GET_ADDRESS_NAME_METHOD_ENDPOINT =
  '/api/command/user/api/method/frappe.contacts.doctype.address.address.get_default_address';
export const RELAY_GET_FULL_ADDRESS_ENDPOINT =
  '/api/command/user/api/resource/Address/';
export const RELAY_COST_CENTER_ENDPOINT =
  '/api/command/user/api/resource/Cost%20Center';
export const RELAY_LIST_TERRITORIES_ENDPOINT =
  '/api/command/user/api/resource/Territory';
export const RELAY_LIST_SALES_RETURN_ENDPOINT =
  '/api/command/user/api/resource/Sales Invoice';
export const RELAY_LIST_NOTE_ENDPOINT = '/api/command/user/api/resource/Note';
export const LIST_TERRITORIES_ENDPOINT = '/api/territory/v1/list';
export const CREATE_TERRITORY_ENDPOINT = '/api/territory/v1/create';
export const UPDATE_TERRITORY_ENDPOINT = '/api/territory/v1/update';
export const DELETE_TERRITORY_ENDPOINT = '/api/territory/v1/remove';
export const API_TERRITORY_GET_WAREHOUSES =
  '/api/territory/v1/get_warehouses_for_territories';
export const LIST_RETURN_VOUCHER_ENDPOINT = 'api/return_voucher/v1/list';
export const LIST_CREDIT_NOTE_ENDPOINT = 'api/credit_note/v1/list';
export const CREDIT_NOTE_ENDPOINT = 'api/credit_note/v1';
export const LIST_DELIVERY_NOTE_ENDPOINT = 'api/delivery_note/v1/list';
export const API_INFO_ENDPOINT = '/api/info';
export const API_ITEM_LIST = '/api/item/v1/list';
export const API_ITEM_SET_MIN_PRICE = '/api/item/v1/set_minimum_item_price';
export const API_ITEM_SET_MRP = '/api/item/v1/set_item_mrp';
export const UPDATE_ITEM_HAS_SERIAL_UPDATE_ENDPOINT =
  '/api/item/v1/update_has_serial';
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
// export const STOCK_AVAILABILITY_ENDPOINT = '/api/command/user/api/resource/Bin';
export const STOCK_AVAILABILITY_COUNT_ENDPOINT =
  '/api/stock_ledger/v1/list_count';
export const STOCK_AVAILABILITY_ENDPOINT = '/api/stock_ledger/v1/list';
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
export const GET_SALES_INVOICE_RETURNED_SERIALS_ENDPOINT =
  '/api/serial_no/v1/get_sales_invoice_returned_serials';
export const GET_PURCHASE_INVOICE_DELIVERED_SERIALS_ENDPOINT =
  '/api/serial_no/v1/get_purchase_invoice_delivered_serials';
export const WARRANTY_CLAIM_GET_ONE_ENDPOINT = '/api/warranty_claim/v1/get/';
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
export const LIST_TERMS_AND_CONDITIONS_ENDPOINT =
  '/api/terms_and_conditions/v1/list';
export const GET_TERMS_AND_CONDITIONS_ENDPOINT =
  '/api/terms_and_conditions/v1/get';
export const ADD_TERMS_AND_CONDITIONS_ENDPOINT =
  '/api/terms_and_conditions/v1/create';
export const UPDATE_TERMS_AND_CONDITIONS_ENDPOINT =
  '/api/terms_and_conditions/v1/update';
export const DELETE_TERMS_AND_CONDITIONS_ENDPOINT =
  '/api/terms_and_conditions/v1/delete';
export const JOB_QUEUE_LIST_ENDPOINT = '/api/job_queue/v1/list';
export const JOB_QUEUE_RETRY_ENDPOINT = '/api/job_queue/v1/retry';
export const JOB_QUEUE_RESYNC_ENDPOINT = '/api/job_queue/v1/resync';
export const JOB_QUEUE_RESET_ENDPOINT = '/api/job_queue/v1/reset';
export const GET_EXPORTED_JOB_ENDPOINT = '/api/job_queue/v1/get_exported_job/';
export const GET_PO_FROM_PI_NUMBER_ENDPOINT =
  '/api/purchase_order/v1/get_po_from_pi_number/';
export const GET_DOCTYPE_COUNT_METHOD =
  '/api/command/user/api/method/frappe.client.get_count';
export const CREATE_SERVICE_INVOICE_ENDPOINT = 'api/service_invoice/v1/create';
export const GET_DIRECT_SERIAL_ENDPOINT = '/api/serial_no/v1/get_direct_serial';
export const GET_ITEM_BY_ITEM_CODE_ENDPOINT = '/api/item/v1/get_by_item_code';
export const CREATE_WARRANTY_CLAIM_ENDPOINT = 'api/warranty_claim/v1/create';
export const RELAY_GET_FULL_ITEM_ENDPOINT =
  '/api/command/user/api/resource/Item/';
export const RELAY_GET_ITEM_STOCK_ENDPOINT =
  '/api/command/user/api/resource/Bin';
export const ADD_STATUS_HISTORY_ENDPOINT =
  '/api/warranty_claim/v1/add_status_history';
export const REMOVE_STATUS_HISTORY_ENDPOINT =
  '/api/warranty_claim/v1/remove_status_history';
export const CREATE_WARRANTY_STOCK_ENTRY =
  '/api/stock_entry/v1/create_warranty_stock';
export const LIST_SERVICE_INVOICE_ENDPOINT = 'api/service_invoice/v1/list';
export const ERPNEXT_POS_PROFILE_ENDPOINT =
  '/api/command/user/api/resource/POS%20Profile';
export const RELAY_LIST_SUPPLIER_ENDPOINT =
  '/api/command/user/api/resource/Supplier';
export const PURCHASE_ORDER_RESET_ENDPOINT =
  '/api/purchase_order/v1/reset_order';
export const RELAY_GET_SALES_PERSON_STOCK_ENDPOINT =
  '/api/command/user/api/resource/Sales Person';
export const RELAY_LIST_PROJECT_ENDPOINT =
  '/api/command/user/api/resource/Project';
export const GET_PRODUCT_BUNDLE_ITEMS = '/api/item/v1/get_bundle_items';
export const STOCK_ENTRY_RESET_ENDPOINT = '/api/stock_entry/v1/reset/';
export const REMOVE_SALES_INVOICE_ENDPOINT = 'api/sales_invoice/v1/remove';
export const PRINT_DELIVERY_INVOICE_ENDPOINT = 'api/print/v1/delivery_invoice';
export const SYNC_FRAPPE_ITEMS_ENDPOINT = '/api/item/v1/sync_items';
export const DELETE_EMPTY_JOBS_ENDPOINT = '/api/job_queue/v1/delete_empty_jobs';
export const GET_STOCK_ENTRY_DELIVERED_SERIALS =
  '/api/stock_entry/v1/get_delivered_serials';

export const GET_STOCK_ENTRY = '/api/stock_entry/v1/get/';

export const SYNC_STOCK_PRINT_ENDPOINT =
  'api/stock_entry/v1/sync_stock_document';

export const INVOICE_LIST = '/api/serial_no/v1/invoicelist';
export const INVOICE_PUT = '/api/serial_no/v1/updateInvoice';
