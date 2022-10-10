import { Column, BaseEntity, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class StockLedger extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

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
  warehouse: string;

  @Column()
  item_code: string;

  @Column()
  reserved_qty: number;

  @Column()
  actual_qty: number;

  @Column()
  ordered_qty: number;

  @Column()
  indented_qty: number;

  @Column()
  planned_qty: number;

  @Column()
  projected_qty: number;

  @Column()
  reserved_qty_for_production: number;

  @Column()
  reserved_qty_for_sub_contract: number;

  @Column()
  ma_rate: number;

  @Column()
  stock_uom: string;

  @Column()
  fcfs_rate: number;

  @Column()
  valuation_rate: number;

  @Column()
  stock_value: number;

  @Column()
  doctype: string;

  @Column()
  batch_no: string;

  @Column()
  posting_date: string;

  @Column()
  posting_time: string;

  @Column()
  voucher_type: string;

  @Column()
  voucher_no: string;

  @Column()
  voucher_detail_no: string;

  @Column()
  incoming_rate: number;

  @Column()
  outgoing_rate: number;

  @Column()
  qty_after_transaction: number;

  @Column()
  stock_value_difference: number;

  @Column()
  company: string;

  @Column()
  fiscal_year: string;

  @Column()
  is_cancelled: string;

  @Column()
  to_rename: number;
}
