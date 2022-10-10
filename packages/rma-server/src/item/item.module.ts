import { Module } from '@nestjs/common';
import { ItemAggregatesManager } from './aggregates';
import { ItemEntitiesModule } from './entity/item-entity.module';
import { ItemQueryManager } from './query';
import { ItemController } from './controllers/item/item.controller';
import { ItemPoliciesService } from './policies/item-policies/item-policies.service';
import { ItemWebhookController } from './controllers/item-webhook/item-webhook.controller';
import { ItemCommandHandlers } from './commands';
import { ItemEventHandlers } from './events';
import { DirectModule } from '../direct/direct.module';

@Module({
  imports: [ItemEntitiesModule, DirectModule],
  controllers: [ItemController, ItemWebhookController],
  providers: [
    ...ItemAggregatesManager,
    ...ItemQueryManager,
    ...ItemCommandHandlers,
    ...ItemEventHandlers,
    ItemPoliciesService,
  ],
  exports: [ItemEntitiesModule, ...ItemAggregatesManager],
})
export class ItemModule {}
