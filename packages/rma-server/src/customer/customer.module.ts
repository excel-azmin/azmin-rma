import { Module } from '@nestjs/common';
import { CustomerAggregatesManager } from './aggregates';
import { CustomerEntitiesModule } from './entity/entity.module';
import { CustomerQueryManager } from './query';
import { CustomerCommandManager } from './command';
import { CustomerEventManager } from './event';
import { CustomerController } from './controllers/customer/customer.controller';
import { CustomerPoliciesService } from './policies/customer-policies/customer-policies.service';
import { CustomerWebhookController } from './controllers/customer-webhook/customer-webhook.controller';
import { TerritoryController } from './controllers/territory/territory.controller';
import { CustomerSchedulers } from './schedulers';
import {} from '../error-log/error-logs-invoice.module';

@Module({
  imports: [CustomerEntitiesModule],
  controllers: [
    CustomerController,
    CustomerWebhookController,
    TerritoryController,
  ],
  providers: [
    ...CustomerAggregatesManager,
    ...CustomerQueryManager,
    ...CustomerEventManager,
    ...CustomerCommandManager,
    ...CustomerSchedulers,
    CustomerPoliciesService,
  ],
  exports: [CustomerEntitiesModule, ...CustomerAggregatesManager],
})
export class CustomerModule {}
