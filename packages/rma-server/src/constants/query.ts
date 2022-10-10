export const SUPPLIER_PROJECT_QUERY = {
  name: 1,
  supplier_name: 1,
  country: 1,
  supplier_type: 1,
  gst_category: 1,
  export_type: 1,
  uuid: 1,
  isSynced: 1,
};
export const CUSTOMER_PROJECT_QUERY = {
  name: 1,
  territory: 1,
  customer_group: 1,
  gst_category: 1,
  customer_type: 1,
  customer_name: 1,
  uuid: 1,
  isSynced: 1,
  credit_limits: 1,
};

export const ITEM_PROJECT_QUERY = {
  name: 1,
  item_code: 1,
  item_name: 1,
  item_group: 1,
  description: 1,
  end_of_life: 1,
  uuid: 1,
  isSynced: 1,
  attributes: 1,
  item_defaults: 1,
  taxes: 1,
  uoms: 1,
};
export const DELIVERY_NOTE_IS_RETURN_FILTER_QUERY = [
  'Delivery Note',
  'is_return',
  '=',
  '1',
];
export const DELIVERY_NOTE_FILTER_BY_SALES_INVOICE_QUERY = [
  'Delivery Note Item',
  'against_sales_invoice',
  '=',
];
export const CREDIT_NOTE_IS_RETURN_QUERY = ['is_return', '=', '1'];
export const CREDIT_NOTE_IS_CANCEL_QUERY = ['status', '!=', 'Cancelled'];
export const CREDIT_NOTE_FILTER_BY_SALES_INVOICE_QUERY = [
  'return_against',
  '=',
];
export const RETURN_VOUCHER_PAYMENT_TYPE_FILTER_QUERY = [
  'payment_type',
  '=',
  'receive',
];
export const RETURN_VOUCHER_FILTER_BY_SALES_INVOICE_QUERY = [
  'Payment Entry Reference',
  'reference_name',
  '=',
];
