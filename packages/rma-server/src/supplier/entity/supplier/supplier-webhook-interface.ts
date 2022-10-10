export interface SupplierWebhookInterface {
  name: string;
  owner: string;
  supplier_name: string;
  country: string;
  default_bank_account: string;
  tax_id: string;
  tax_category: string;
  supplier_type: string;
  is_internal_supplier: string;
  represents_company: string;
  pan: string;
  disabled: string;
  docstatus: string;
  gst_category: string;
  export_type: string;
  isSynced?: boolean;
}
