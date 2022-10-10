import { ObjectID, ObjectIdColumn, Entity, Column, BaseEntity } from 'typeorm';

@Entity()
export class RequestState extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  redirect: string;

  @Column()
  creation: Date;

  @Column()
  email: string;

  @Column()
  syncDocType: string;
}
