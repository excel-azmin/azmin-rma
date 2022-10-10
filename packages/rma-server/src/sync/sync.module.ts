import { Module, HttpModule } from '@nestjs/common';
import { PurchaseReceiptModule } from '../purchase-receipt/purchase-receipt.module';
import { StockEntryModule } from '../stock-entry/stock-entry.module';
import { DeliveryNoteModule } from '../delivery-note/delivery-note.module';
import { FrappeJobService } from './schedular/frappe-jobs-queue/frappe-jobs-queue.service';
import { JobQueueController } from './controllers/job-queue/job-queue.controller';
import { SyncAggregateManager } from './aggregates';
import { DirectModule } from '../direct/direct.module';
import { SettingsService } from '../system-settings/aggregates/settings/settings.service';

@Module({
  imports: [
    HttpModule,
    PurchaseReceiptModule,
    StockEntryModule,
    DirectModule,
    DeliveryNoteModule,
  ],
  controllers: [JobQueueController],
  providers: [FrappeJobService, ...SyncAggregateManager, SettingsService],
  exports: [FrappeJobService, ...SyncAggregateManager],
})
export class SyncModule {}
