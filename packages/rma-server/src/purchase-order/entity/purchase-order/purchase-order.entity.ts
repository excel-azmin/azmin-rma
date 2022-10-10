import { Column, ObjectIdColumn, ObjectID, Entity, Index } from 'typeorm';
import { PurchaseOrderItem } from './purchase-order-item.interface';
import { PaymentSchedule } from './po-payment-schedule.interface';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class PurchaseOrder {
  @ObjectIdColumn()
  _id: ObjectID;
  @Index()
  @Column()
  uuid: string;
  @Index()
  @Column()
  name: string;
  @Column()
  owner: string;
  @Column()
  creation: string;
  @Column()
  modified: string;
  @Column()
  modified_by: string;
  @Column()
  idx: number;
  @Column()
  docstatus: number;
  @Column()
  title: string;
  @Column()
  naming_series: string;
  @Column()
  supplier: string;
  @Column()
  supplier_name: string;
  @Column()
  company: string;
  @Column()
  transaction_date: string;
  @Column()
  schedule_date: string;
  @Column()
  supplier_address: string;
  @Column()
  address_display: string;
  @Column()
  currency: string;
  @Column()
  conversion_rate: number;
  @Column()
  buying_price_list: string;
  @Column()
  price_list_currency: string;
  @Column()
  plc_conversion_rate: number;
  @Column()
  ignore_pricing_rule: number;
  @Column()
  is_subcontracted: string;
  @Column()
  total_qty: number;
  @Column()
  base_total: number;
  @Column()
  base_net_total: number;
  @Column()
  total: number;
  @Column()
  net_total: number;
  @Column()
  total_net_weight: number;
  @Column()
  base_taxes_and_charges_added: number;
  @Column()
  base_taxes_and_charges_deducted: number;
  @Column()
  base_total_taxes_and_charges: number;
  @Column()
  taxes_and_charges_added: number;
  @Column()
  taxes_and_charges_deducted: number;
  @Column()
  total_taxes_and_charges: number;
  @Column()
  apply_discount_on: string;
  @Column()
  base_discount_amount: number;
  @Column()
  additional_discount_percentage: number;
  @Column()
  discount_amount: number;
  @Column()
  base_grand_total: number;
  @Column()
  base_rounding_adjustment: number;
  @Column()
  base_in_words: string;
  @Column()
  base_rounded_total: number;
  @Column()
  grand_total: number;
  @Column()
  rounding_adjustment: number;
  @Column()
  rounded_total: number;
  @Column()
  disable_rounded_total: number;
  @Column()
  in_words: string;
  @Column()
  advance_paid: number;
  @Column()
  terms: string;
  @Column()
  status: string;
  @Column()
  party_account_currency: string;
  @Column()
  per_received: number;
  @Column()
  per_billed: number;
  @Column()
  group_same_items: number;
  @Column()
  language: string;
  @Column()
  doctype: string;
  @Column()
  purchase_invoice_name: string;
  @Column()
  items: PurchaseOrderItem[];
  @Column()
  pricing_rules: any[];
  @Column()
  supplied_items: any[];
  @Column()
  taxes: any[];
  @Column()
  payment_schedule: PaymentSchedule[];
  @Column()
  isSynced: boolean;
  @Column()
  inQueue: boolean;
  @Column()
  submitted: boolean;
  @Column()
  created_on: Date;
  @Column()
  created_by: string;
  constructor() {
    this.uuid = uuidv4();
  }
}
