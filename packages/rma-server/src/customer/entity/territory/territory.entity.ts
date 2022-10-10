import { Column, ObjectIdColumn, BaseEntity, ObjectID, Entity } from 'typeorm';

@Entity()
export class Territory extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column()
  warehouse: string;
}
