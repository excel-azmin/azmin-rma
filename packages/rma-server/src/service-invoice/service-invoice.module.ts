import { Module, HttpModule } from '@nestjs/common';
import { ServiceInvoiceAggregatesManager } from './aggregates';
import { ServiceInvoiceEntitiesModule } from './entity/entity.module';
import { ServiceInvoiceQueryManager } from './query';
import { CqrsModule } from '@nestjs/cqrs';
import { ServiceInvoiceCommandManager } from './command';
import { ServiceInvoiceEventManager } from './event';
import { ServiceInvoiceController } from './controllers/service-invoice/service-invoice.controller';
import { ServiceInvoicePoliciesService } from './policies/service-invoice-policies/service-invoice-policies.service';
import { WarrantyClaimEntitiesModule } from '../warranty-claim/entity/entity.module';

@Module({
  imports: [
    ServiceInvoiceEntitiesModule,
    WarrantyClaimEntitiesModule,
    CqrsModule,
    HttpModule,
  ],
  controllers: [ServiceInvoiceController],
  providers: [
    ...ServiceInvoiceAggregatesManager,
    ...ServiceInvoiceQueryManager,
    ...ServiceInvoiceEventManager,
    ...ServiceInvoiceCommandManager,
    ServiceInvoicePoliciesService,
  ],
  exports: [ServiceInvoiceEntitiesModule],
})
export class ServiceInvoiceModule {}
