import { Module } from '@nestjs/common';
import { PurchaseOrderEntitiesModule } from './entity/entity.module';
import { DirectModule } from '../direct/direct.module';
import { PurchaseOrderControllers } from './controllers';
import { PurchaseOrderAggregates } from './aggregates';
import { PurchaseOrderQueries } from './query';
import { PurchaseOrderPoliciesManager } from './policies';
import { SerialNoEntitiesModule } from '../serial-no/entity/entity.module';
import { PurchaseInvoiceEntitiesModule } from '../purchase-invoice/entity/entity.module';
import { PurchaseReceiptModule } from '../purchase-receipt/purchase-receipt.module';
import { StockLedgerEntitiesModule } from '../stock-ledger/entity/entity.module';

@Module({
  imports: [
    StockLedgerEntitiesModule,
    PurchaseOrderEntitiesModule,
    DirectModule,
    SerialNoEntitiesModule,
    PurchaseInvoiceEntitiesModule,
    PurchaseReceiptModule,
  ],
  providers: [
    ...PurchaseOrderAggregates,
    ...PurchaseOrderQueries,
    ...PurchaseOrderPoliciesManager,
  ],
  exports: [PurchaseOrderEntitiesModule],
  controllers: [...PurchaseOrderControllers],
})
export class PurchaseOrderModule {}
