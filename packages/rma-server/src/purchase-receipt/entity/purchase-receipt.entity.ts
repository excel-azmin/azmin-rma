import { Column, ObjectIdColumn, ObjectID, Entity } from 'typeorm';

@Entity()
export class PurchaseReceipt {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  purchase_invoice_name: string;

  @Column()
  amount: number;

  @Column()
  cost_center: string;

  @Column()
  expense_account: string;

  @Column()
  item_code: string;

  @Column()
  item_name: string;

  @Column()
  purchase_order?: string;

  @Column()
  name: string;

  @Column()
  qty: number;

  @Column()
  rate: number;

  @Column()
  serial_no: string[];

  @Column()
  warehouse: string;

  @Column()
  deliveredBy: string;

  @Column()
  deliveredByEmail: string;
}
