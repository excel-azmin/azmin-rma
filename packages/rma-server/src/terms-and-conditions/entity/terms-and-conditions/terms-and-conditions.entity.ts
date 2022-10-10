import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';

@Entity()
export class TermsAndConditions extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  terms_and_conditions: string;
}
