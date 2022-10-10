export interface BulkWarrantyClaimInterface {
  company: string;
  supplier: string;
  claims: BulkWarrantyClaim[];
}

export interface BulkWarrantyClaim {
  serial_no: string;
  claim_no: string;
  claim_type: string;
  company: string;
  supplier: string;
  customer_third_party: string;
  item_code: string;
  itemWarrantyDate: Date;
  claimed_serial: string;
  invoice_no: string;
  service_charge: string;

  claim_status: string;
  warranty_status: string;
  receiving_branch: string;
  delivery_branch: string;
  received_by: string;
  delivered_by: string;
  received_date: Date;
  deliver_date: Date;
  brand: string;
}
