import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';

@Entity()
export class Problem extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  problem_name: string;
}
