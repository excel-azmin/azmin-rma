import { Column, ObjectIdColumn, BaseEntity, ObjectID, Entity } from 'typeorm';

export class Timestamp {
  created_on: Date;
}
@Entity()
export class SalesInvoice extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  created_on: Date;

  @Column()
  name: string;

  @Column()
  naming_series: string;

  @Column()
  customer_name: string;

  @Column()
  outstanding_amount: string;

  @Column()
  is_return: boolean;

  @Column()
  issue_credit_note: boolean;

  @Column()
  title: string;

  @Column()
  customer: string;

  @Column()
  company: string;

  @Column()
  posting_date: string;

  @Column()
  posting_time: string;

  @Column()
  set_posting_time: number;

  @Column()
  due_date: string;

  @Column()
  address_display: string;

  @Column()
  contact_person: string;

  @Column()
  contact_display: string;

  @Column()
  contact_email: string;

  @Column()
  territory: string;

  @Column()
  delivery_warehouse: string;

  @Column()
  update_stock: number;

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
  pos_total_qty: number;

  @Column()
  items: Item[];

  @Column()
  delivery_note_items: any[] = [];

  @Column()
  delivery_note_names: string[] = [];

  @Column()
  returned_items: any[] = [];

  @Column()
  delivered_items_map: any = {};

  @Column()
  bundle_items_map: any = {};

  @Column()
  returned_items_map: any = {};

  @Column()
  pricing_rules: [];

  @Column()
  packed_items: [];

  @Column()
  timesheets: [];

  @Column()
  taxes: Tax[];

  @Column()
  advances: [];

  @Column()
  payment_schedule: [];

  @Column()
  payments: Payments[];

  @Column()
  sales_team: [];

  @Column()
  status: string;

  @Column()
  createdBy: string;

  @Column()
  createdByEmail: string;

  @Column()
  submitted: boolean;

  @Column()
  credit_note: string;

  @Column()
  timeStamp: Timestamp;

  @Column()
  inQueue: boolean;

  @Column()
  isSynced: boolean;

  @Column()
  isCampaign: boolean;

  @Column()
  remarks: string;

  @Column()
  has_bundle_item: boolean;

  @Column()
  modified: string;

  @Column()
  delivery_status: string;

  @Column()
  transactionLock: number;

  @Column()
  is_pos: boolean;

  @Column()
  pos_profile: string;
}

export class Tax {
  name: string;
  charge_type: string;
  tax_amount: number;
  total: number;
  account_head: string;
  description: string;
  rate: number;
}

export class Item {
  name: string;
  owner: string;
  item_code: string;
  has_serial_no?: number;
  has_bundle_item?: boolean;
  is_stock_item?: number;
  item_name: string;
  qty: number;
  rate: number;
  amount: number;
  serial_no?: string;
  excel_serials: string;
}

export class Payments {
  mode_of_payment?: string;
  default?: boolean;
  amount?: number;
  account?: string;
  excel_serials: string;
}
