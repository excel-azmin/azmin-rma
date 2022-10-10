import {
  Column,
  ObjectIdColumn,
  BaseEntity,
  ObjectID,
  Entity,
  Index,
} from 'typeorm';

@Entity()
export class Supplier extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column()
  owner: string;

  @Column()
  supplier_name: string;

  @Column()
  country: string;

  @Column()
  default_bank_account: string;

  @Column()
  tax_id: string;

  @Column()
  tax_category: string;

  @Column()
  supplier_type: string;

  @Column()
  is_internal_supplier: string;

  @Column()
  represents_company: string;

  @Column()
  pan: string;

  @Column()
  disabled: string;

  @Column()
  docstatus: string;

  @Column()
  gst_category: string;

  @Column()
  export_type: string;

  @Column()
  isSynced: boolean;
}
