import { Module } from '@nestjs/common';
import { PurchaseInvoiceAggregatesManager } from './aggregates';
import { PurchaseInvoiceEntitiesModule } from './entity/entity.module';
import { PurchaseInvoiceQueryManager } from './query';
import { PurchaseInvoiceCommandManager } from './command';
import { PurchaseInvoiceEventManager } from './event';
import { PurchaseInvoiceController } from './controllers/purchase-invoice/purchase-invoice.controller';
import { PurchaseInvoicePoliciesService } from './policies/purchase-invoice-policies/purchase-invoice-policies.service';
import { PurchaseInvoiceWebhookController } from './controllers/purchase-invoice-webhook/purchase-invoice-webhook.controller';
import { ItemEntitiesModule } from '../item/entity/item-entity.module';
import { PurchaseOrderEntitiesModule } from '../purchase-order/entity/entity.module';

@Module({
  imports: [
    PurchaseInvoiceEntitiesModule,
    ItemEntitiesModule,
    PurchaseOrderEntitiesModule,
  ],
  controllers: [PurchaseInvoiceController, PurchaseInvoiceWebhookController],
  providers: [
    ...PurchaseInvoiceAggregatesManager,
    ...PurchaseInvoiceQueryManager,
    ...PurchaseInvoiceEventManager,
    ...PurchaseInvoiceCommandManager,
    PurchaseInvoicePoliciesService,
  ],
  exports: [PurchaseInvoiceEntitiesModule],
})
export class PurchaseInvoiceModule {}
