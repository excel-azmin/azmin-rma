import { Module } from '@nestjs/common';
import { StockLedgerAggregateService } from './aggregates/stock-ledger-aggregate/stock-ledger-aggregate.service';
import { StockLedgerController } from './controller/stock-ledger.controller';
import { StockLedgerEntitiesModule } from './entity/entity.module';

@Module({
  imports: [StockLedgerEntitiesModule],
  controllers: [StockLedgerController],
  providers: [StockLedgerAggregateService],
  exports: [StockLedgerEntitiesModule],
})
export class StockLedgerModule {}
