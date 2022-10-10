import { Column, BaseEntity, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class StockEntry extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  docstatus?: 1;

  @Column()
  names: string[];

  @Column()
  createdOn: string;

  @Column()
  created_by_email: string;

  @Column()
  createdByEmail: string;

  @Column()
  customer: string;

  @Column()
  createdBy: string;

  @Column()
  stock_entry_type: string;

  @Column()
  set_posting_time: number;

  @Column()
  status: string;

  @Column()
  createdAt: Date;

  @Column()
  company: string;

  @Column()
  posting_date: string;

  @Column()
  posting_time: string;

  @Column()
  doctype: string;

  @Column()
  inQueue: boolean;

  @Column()
  isSynced: boolean;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  remarks: string;

  @Column()
  territory: string;

  @Column()
  warrantyClaimUuid: string;

  @Column()
  stock_voucher_number: string;

  @Column()
  items: StockEntryItem[];

  @Column()
  item_data: any;

  @Column({ unique: true })
  stock_id: any;

  naming_series?: string;
}

export class StockEntryItem {
  s_warehouse: string;
  t_warehouse: string;
  warehouse?: string;
  item_code: string;
  item_name: string;
  excel_serials?: string;
  qty: number;
  basic_rate?: number;
  has_serial_no: number;
  transfer_qty: number;
  warranty_date?: string;
  transferWarehouse: string;
  serial_no: string[];
}
