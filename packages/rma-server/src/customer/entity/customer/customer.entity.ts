import { Column, ObjectIdColumn, ObjectID, Entity, Index } from 'typeorm';

export class CustomerCreditLimit {
  credit_limit: number;
  company: string;
}

@Entity()
export class Customer {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column()
  company: string;

  @Column()
  owner: string;

  @Column()
  sales_team: any[];

  @Column()
  customer_name: string;

  @Column()
  customer_type: string;

  @Column()
  gst_category: string;

  @Column()
  customer_group: string;

  @Column()
  payment_terms: string;

  @Column()
  credit_days: number;

  @Column()
  territory: string;

  @Column()
  credit_limits: CustomerCreditLimit[];

  @Column()
  isSynced: boolean;

  @Column()
  baseCreditLimitAmount: number;

  @Column()
  tempCreditLimitPeriod: Date;

  @Column()
  creditLimitSetBy: string;

  @Column()
  creditLimitSetByFullName: string;

  @Column()
  creditLimitUpdatedOn: Date;
}
