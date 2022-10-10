import { Module } from '@nestjs/common';
import { SupplierAggregatesManager } from './aggregates';
import { SupplierEntitiesModule } from './entity/entity.module';
import { SupplierQueryManager } from './query';
import { SupplierCommandManager } from './command';
import { SupplierEventManager } from './event';
import { SupplierController } from './controllers/supplier/supplier.controller';
import { SupplierPoliciesService } from './policies/supplier-policies/supplier-policies.service';
import { SupplierWebhookController } from './controllers/supplier-webhook/supplier-webhook.controller';

@Module({
  imports: [SupplierEntitiesModule],
  controllers: [SupplierController, SupplierWebhookController],
  providers: [
    ...SupplierAggregatesManager,
    ...SupplierQueryManager,
    ...SupplierEventManager,
    ...SupplierCommandManager,
    SupplierPoliciesService,
  ],
  exports: [SupplierEntitiesModule, ...SupplierAggregatesManager],
})
export class SupplierModule {}
