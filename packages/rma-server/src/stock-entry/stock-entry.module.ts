import { StockEntryAggregateService } from './aggregates/stock-entry-aggregate/stock-entry-aggregate.service';
import { StockEntryPoliciesService } from './policies/stock-entry-policies/stock-entry-policies.service';
import { StockEntryController } from './controller/stock-entry.controller';
import { Module } from '@nestjs/common';
import { StockEntry } from './entities/stock-entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntryService } from './entities/stock-entry.service';
import { SerialNoEntitiesModule } from '../serial-no/entity/entity.module';
import { DirectModule } from '../direct/direct.module';
import { StockEntrySyncService } from './schedular/stock-entry-sync/stock-entry-sync.service';
import { SerialBatchService } from '../sync/aggregates/serial-batch/serial-batch.service';
import { WarrantyStockEntryAggregateService } from './aggregates/warranty-stock-entry-aggregate/warranty-stock-entry-aggregate.service';
import { SerialNoModule } from '../serial-no/serial-no.module';
import { WarrantyClaimModule } from '../warranty-claim/warranty-claim.module';
import { StockLedgerEntitiesModule } from '../stock-ledger/entity/entity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockEntry]),
    SerialNoEntitiesModule,
    StockLedgerEntitiesModule,
    DirectModule,
    SerialNoModule,
    WarrantyClaimModule,
  ],
  controllers: [StockEntryController],
  providers: [
    WarrantyStockEntryAggregateService,
    StockEntryAggregateService,
    StockEntryPoliciesService,
    StockEntryService,
    StockEntrySyncService,
    SerialBatchService,
  ],
  exports: [StockEntrySyncService],
})
export class StockEntryModule {}
