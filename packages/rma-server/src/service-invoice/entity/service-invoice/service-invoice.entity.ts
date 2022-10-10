import { Column, ObjectIdColumn, BaseEntity, ObjectID, Entity } from 'typeorm';
import { Item } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.entity';

@Entity()
export class ServiceInvoice extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  warrantyClaimUuid: string;

  @Column()
  name: string;

  @Column()
  invoice_no: string;

  @Column()
  status: string;

  @Column()
  date: Date;

  @Column()
  customer_third_party: string;

  @Column()
  invoice_amount: number;

  @Column()
  outstanding_amount: number;

  @Column()
  claim_no: string;

  @Column()
  remarks: string;

  @Column()
  branch: string;

  @Column()
  created_by: string;

  @Column()
  submitted_by: string;

  @Column()
  posting_date: Date;

  @Column()
  customer_name: string;

  @Column()
  customer_address: string;

  @Column()
  customer_contact: string;

  @Column()
  third_party_name: string;

  @Column()
  third_party_address: string;

  @Column()
  third_party_contact: string;

  @Column()
  total: number;

  @Column()
  items: Item[];

  @Column()
  customer: string;

  @Column()
  total_qty: number;

  @Column()
  contact_email: string;

  @Column()
  due_date: Date;

  @Column()
  delivery_warehouse: string;

  @Column()
  docstatus: number;
}
