import { Column, ObjectIdColumn, ObjectID, Entity } from 'typeorm';

@Entity()
export class ErrorLog {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  docType: string;

  @Column()
  entity: string;

  @Column()
  url: string;

  @Column()
  body: string;

  @Column()
  method: string;

  @Column()
  user: string;

  @Column()
  token: string;

  @Column()
  createdOn: Date;

  @Column()
  error: string;

  @Column()
  message: string;
}
