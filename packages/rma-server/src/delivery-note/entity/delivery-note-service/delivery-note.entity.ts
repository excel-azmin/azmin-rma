import { Entity, Column, ObjectID, BaseEntity, ObjectIdColumn } from 'typeorm';

@Entity()
export class DeliveryNote extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  isSynced: boolean;

  @Column()
  inQueue: boolean;

  @Column()
  name: string;

  @Column()
  modified_by: string;

  @Column()
  docstatus: number;

  @Column()
  title: string;

  @Column()
  naming_series: string;

  @Column()
  issue_credit_note: boolean;

  @Column()
  customer: string;

  @Column()
  customer_name: string;

  @Column()
  company: string;

  @Column()
  posting_date: string;

  @Column()
  createdBy: string;

  @Column()
  createdByEmail: string;

  @Column()
  contact_email: string;

  @Column()
  posting_time: string;

  @Column()
  is_return: boolean;

  @Column()
  currency: string;

  @Column()
  conversion_rate: number;

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
  base_grand_total: number;

  @Column()
  customer_group: string;

  @Column()
  territory: string;

  @Column()
  set_warehouse: string;

  @Column()
  items: DeliveryNoteItems[];

  @Column()
  pricing_rules: DeliveryNotePricingRules[];

  @Column()
  packed_items: DeliveryNotePackedItems[];

  @Column()
  taxes: DeliveryNoteTaxes[];

  @Column()
  instructions: string;

  @Column()
  sales_team: DeliveryNoteSalesTeam[];
  credit_note_items?: any[];
}
export class DeliveryNoteItems {
  name: string;
  item_code: string;
  item_name: string;
  description: string;
  is_nil_exempt: number;
  is_non_gst: number;
  item_group: string;
  image: string;
  qty: number;
  excel_serials: string;
  has_serial_no: number;
  conversion_factor: number;
  stock_qty: number;
  price_list_rate: number;
  warranty_date?: string;
  base_price_list_rate: number;
  rate: number;
  serial_no: string;
  amount: number;
}
export class DeliveryNoteTaxes {
  name: string;
  docstatus: number;
  charge_type: string;
  account_head: string;
  description: string;
  cost_center: string;
  rate: number;
  tax_amount: number;
  total: number;
}
export class DeliveryNotePricingRules {}
export class DeliveryNotePackedItems {}
export class DeliveryNoteSalesTeam {}
