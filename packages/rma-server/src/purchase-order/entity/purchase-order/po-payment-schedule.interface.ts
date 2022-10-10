export interface PaymentSchedule {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  idx: number;
  docstatus: number;
  due_date: string;
  invoice_portion: number;
  payment_amount: number;
  doctype: string;
}
