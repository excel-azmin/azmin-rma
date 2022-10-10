import {
  Column,
  ObjectIdColumn,
  BaseEntity,
  ObjectID,
  Entity,
  Index,
} from 'typeorm';
import { ItemBundleItemWebhookInterface } from './item-webhook-interface';

export class Barcodes {
  name: string;
  idx: number;
  docstatus: number;
  barcode: string;
  barcode_type: string;
}

export class Uom {
  name: string;
  idx: number;
  docstatus: number;
  conversion_factor: number;
  uom: string;
  doctype: string;
}
export class ItemDefaults {
  company: string;
  default_warehouse: string;
  doctype: string;
}

@Entity()
export class Item extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  creation: string;

  @Column()
  modified: string;

  @Column()
  name: string;

  @Column()
  owner: string;

  @Column()
  modified_by: string;

  @Column()
  docstatus: number;

  @Column()
  @Index({ unique: true })
  item_code: string;

  @Column()
  item_name: string;

  @Column()
  item_group: string;

  @Column()
  stock_uom: string;

  @Column()
  disabled: number;

  @Column()
  description: string;

  @Column()
  shelf_life_in_days: number;

  @Column()
  end_of_life: string;

  @Column()
  default_material_request_type: string;

  @Column()
  has_serial_no: number;

  @Column()
  has_variants: number;

  @Column()
  is_purchase_item: number;

  @Column()
  min_order_qty: number;

  @Column()
  safety_stock: number;

  @Column()
  last_purchase_rate: number;

  @Column()
  country_of_origin: string;

  @Column()
  is_sales_item: number;

  @Column()
  taxes: any[];

  @Column()
  attributes: any[];

  @Column()
  uoms: Uom[];

  @Column()
  item_defaults: ItemDefaults[];

  @Column()
  isSynced: boolean;

  @Column()
  minimumPrice: number;

  @Column()
  purchaseWarrantyMonths: number;

  @Column()
  salesWarrantyMonths: number;

  @Column()
  brand: string;

  @Column()
  is_stock_item: number;

  @Column()
  mrp: number;

  @Column()
  bundle_items: ItemBundleItemWebhookInterface[];

  @Column()
  excel_serials: string;
}
