import { Entity, BaseEntity, ObjectIdColumn, Column, ObjectID } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class TokenCache extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;
  @Column()
  accessToken: string;
  @Column()
  uuid: string;
  @Column()
  active: boolean;
  @Column()
  exp: number;
  @Column()
  email: string;
  @Column()
  sub: string;
  @Column()
  scope: string[];
  @Column()
  roles: string[];
  @Column()
  territory: string[];
  @Column()
  warehouses: string[];
  @Column()
  clientId: string;
  @Column()
  refreshToken: string;
  @Column()
  trustedClient: boolean;
  @Column()
  status: string;
  @Column()
  name: string;
  @Column()
  fullName: string;
  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}
