import {
  ConfigService,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  MONGO_URI_PREFIX,
  CACHE_DB_USER,
  CACHE_DB_PASSWORD,
  CACHE_DB_NAME,
} from '../config/config.service';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { ServerSettings } from '../system-settings/entities/server-settings/server-settings.entity';
import { TokenCache } from '../auth/entities/token-cache/token-cache.entity';
import { RequestState } from '../direct/entities/request-state/request-state.entity';
import { Customer } from '../customer/entity/customer/customer.entity';
import { Item } from '../item/entity/item/item.entity';
import { Supplier } from '../supplier/entity/supplier/supplier.entity';
import { SerialNo } from '../serial-no/entity/serial-no/serial-no.entity';
import { SalesInvoice } from '../sales-invoice/entity/sales-invoice/sales-invoice.entity';
import { WarrantyClaim } from '../warranty-claim/entity/warranty-claim/warranty-claim.entity';
import { DeliveryNote } from '../delivery-note/entity/delivery-note-service/delivery-note.entity';
import { Territory } from '../customer/entity/territory/territory.entity';
import { PurchaseInvoice } from '../purchase-invoice/entity/purchase-invoice/purchase-invoice.entity';
import { ErrorLog } from '../error-log/error-log-service/error-log.entity';
import { PurchaseReceipt } from '../purchase-receipt/entity/purchase-receipt.entity';
import { PurchaseOrder } from '../purchase-order/entity/purchase-order/purchase-order.entity';
import { StockEntry } from '../stock-entry/entities/stock-entry.entity';
import { Problem } from '../problem/entity/problem/problem-entity';
import { AgendaJob } from '../sync/entities/agenda-job/agenda-job.entity';
import { ServiceInvoice } from '../service-invoice/entity/service-invoice/service-invoice.entity';
import { SerialNoHistory } from '../serial-no/entity/serial-no-history/serial-no-history.entity';
import { TermsAndConditions } from '../terms-and-conditions/entity/terms-and-conditions/terms-and-conditions.entity';
import { StockLedger } from '../stock-ledger/entity/stock-ledger/stock-ledger.entity';

export const TOKEN_CACHE_CONNECTION = 'tokencache';
export const DEFAULT = 'default';

export function connectTypeORM(config: ConfigService): MongoConnectionOptions {
  const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
  const mongoOptions = 'retryWrites=true';
  return {
    name: DEFAULT,
    url: `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
      DB_PASSWORD,
    )}@${config.get(DB_HOST)}/${config.get(DB_NAME)}?${mongoOptions}`,
    type: 'mongodb',
    logging: false,
    synchronize: true,
    entities: [
      ServerSettings,
      RequestState,
      Customer,
      Item,
      Supplier,
      SerialNo,
      SalesInvoice,
      WarrantyClaim,
      DeliveryNote,
      Territory,
      StockEntry,
      PurchaseInvoice,
      PurchaseReceipt,
      ErrorLog,
      PurchaseOrder,
      Problem,
      AgendaJob,
      ServiceInvoice,
      SerialNoHistory,
      TermsAndConditions,
      StockLedger,
    ],
    useNewUrlParser: true,
    w: 'majority',
    useUnifiedTopology: true,
  };
}

export function connectTypeORMTokenCache(
  config: ConfigService,
): MongoConnectionOptions {
  const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
  const mongoOptions = 'retryWrites=true';
  return {
    name: TOKEN_CACHE_CONNECTION,
    url: `${mongoUriPrefix}://${config.get(CACHE_DB_USER)}:${config.get(
      CACHE_DB_PASSWORD,
    )}@${config.get(DB_HOST)}/${config.get(CACHE_DB_NAME)}?${mongoOptions}`,
    type: 'mongodb',
    logging: false,
    synchronize: true,
    entities: [TokenCache],
    useNewUrlParser: true,
    w: 'majority',
    useUnifiedTopology: true,
  };
}
