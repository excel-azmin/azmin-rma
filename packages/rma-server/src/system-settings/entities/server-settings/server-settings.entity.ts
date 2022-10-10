import { Column, Entity, BaseEntity, ObjectID, ObjectIdColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SERVICE } from '../../../constants/app-strings';

@Entity()
export class ServerSettings extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  appURL: string;

  @Column()
  warrantyAppURL: string;

  @Column()
  posAppURL: string;

  @Column()
  authServerURL: string;

  @Column()
  frontendClientId: string;

  @Column()
  backendClientId: string;

  @Column()
  serviceAccountUser: string;

  @Column()
  serviceAccountSecret: string;

  @Column()
  profileURL: string;

  @Column()
  headerImageURL: string;

  @Column()
  footerImageURL: string;

  @Column()
  headerWidth: number;

  @Column()
  footerWidth: number;

  @Column()
  tokenURL: string;

  @Column()
  authorizationURL: string;

  @Column()
  revocationURL: string;

  @Column()
  service: string = SERVICE;

  @Column()
  cloudStorageSettings: string;

  @Column()
  callbackProtocol: string;

  @Column()
  scope: string[];

  @Column()
  webhookApiKey: string;

  @Column()
  frontendCallbackURLs: string[];

  @Column()
  backendCallbackURLs: string[];

  @Column()
  defaultCompany: string;

  @Column()
  sellingPriceList: string;

  @Column()
  timeZone: string;

  @Column()
  validateStock: boolean;

  @Column()
  transferWarehouse: string;

  @Column()
  debtorAccount: string;

  @Column()
  serviceAccountApiKey: string;

  @Column()
  serviceAccountApiSecret: string;

  @Column()
  posProfile: string;

  @Column()
  brand: BrandSettings;

  @Column()
  backdatedInvoices: boolean;

  @Column()
  backdatedInvoicesForDays: number;

  constructor() {
    super();
    if (!this.uuid) this.uuid = uuidv4();
  }
}

export interface BrandSettings {
  faviconURL: string;
}
