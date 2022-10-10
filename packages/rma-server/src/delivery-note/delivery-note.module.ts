import { Module } from '@nestjs/common';
import { DeliveryNoteAggregatesManager } from './aggregates';
import { DeliveryNoteEntitiesModule } from './entity/delivery-note-entity.module';
import { DeliveryNoteController } from './controller/delivery-note/delivery-note.controller';
import { DeliveryNoteWebhookController } from './controller/delivery-note-webhook/delivery-note-webhook.controller';
import { SerialNoEntitiesModule } from '../serial-no/entity/entity.module';
import { SalesInvoiceEntitiesModule } from '../sales-invoice/entity/entity.module';
import { DeliveryNoteCommandHandler } from './command';
import { DeliveryNoteQueryManager } from './queries';
import { DeliveryNoteCommandManager } from './commands';
import { DeliveryNoteEventManager } from './events';
import { DeliveryNoteJobService } from './schedular/delivery-note-job/delivery-note-job.service';
import { DirectModule } from '../direct/direct.module';
import { SerialBatchService } from '../sync/aggregates/serial-batch/serial-batch.service';
import { DeliveryNoteJobHelperService } from './schedular/delivery-note-job-helper/delivery-note-job-helper.service';
import { DeliveryNOtePoliciesManager } from './policies';
import { SerialNoPoliciesService } from '../serial-no/policies/serial-no-policies/serial-no-policies.service';
import { ItemEntitiesModule } from '../item/entity/item-entity.module';
import { SupplierEntitiesModule } from '../supplier/entity/entity.module';
import { StockLedgerEntitiesModule } from '../stock-ledger/entity/entity.module';

@Module({
  imports: [
    StockLedgerEntitiesModule,
    DeliveryNoteEntitiesModule,
    SerialNoEntitiesModule,
    SalesInvoiceEntitiesModule,
    DirectModule,
    SupplierEntitiesModule,
    ItemEntitiesModule,
  ],
  controllers: [DeliveryNoteController, DeliveryNoteWebhookController],
  providers: [
    ...DeliveryNoteAggregatesManager,
    ...DeliveryNoteCommandHandler,
    ...DeliveryNoteQueryManager,
    ...DeliveryNoteCommandManager,
    ...DeliveryNoteEventManager,
    ...DeliveryNOtePoliciesManager,
    SerialNoPoliciesService,
    DeliveryNoteJobService,
    SerialBatchService,
    DeliveryNoteJobHelperService,
  ],
  exports: [
    DeliveryNoteEntitiesModule,
    ...DeliveryNoteAggregatesManager,
    DeliveryNoteJobService,
    DeliveryNoteJobHelperService,
  ],
})
export class DeliveryNoteModule {}
