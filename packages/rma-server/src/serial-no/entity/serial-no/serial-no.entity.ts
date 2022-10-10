import {
  Column,
  ObjectIdColumn,
  BaseEntity,
  ObjectID,
  Entity,
  Index,
} from 'typeorm';

export class Warranty {
  purchaseWarrantyDate: string;
  salesWarrantyDate: Date;
  purchasedOn: Date;
  soldOn: Date;
}
export class QueueState {
  purchase_receipt: {
    parent: string;
    warehouse: string;
  };
  delivery_note: {
    parent: string;
    warehouse: string;
  };
  stock_entry: {
    parent: string;
    source_warehouse: string;
    target_warehouse: string;
  };
}

@Entity()
export class SerialNo extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  uuid: string;

  isSynced: boolean;

  warranty_expiry_date: string;

  modified: boolean;

  @Column()
  name: string;

  @Column()
  owner: string;

  @Column()
  creation: string;

  @Column()
  @Index()
  sales_invoice_name: string;

  @Column()
  @Index({ unique: true })
  serial_no: string;

  @Column()
  @Index()
  item_code: string;

  @Column()
  item_name: string;

  @Column()
  description: string;

  @Column()
  item_group: string;

  @Column()
  purchase_time: string;

  @Column()
  purchase_rate: number;

  @Column()
  supplier: string;

  @Column()
  customer: string;

  @Column()
  @Index()
  warehouse: string;

  @Column()
  delivery_note: string;

  @Column()
  purchase_document_no: string;

  @Column()
  sales_return_name: string;

  @Column()
  purchase_document_type: string;

  @Column()
  sales_document_type: string;

  @Column()
  sales_document_no: string;

  @Column()
  company: string;

  @Column()
  warranty: Warranty;

  @Column()
  purchase_date: string;

  @Column()
  queue_state: QueueState;

  @Column()
  @Index()
  purchase_invoice_name: string;

  @Column()
  brand: string;

  @Column()
  claim_no: string;
}
