import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockLedger } from './stock-ledger/stock-ledger.entity';
import { StockLedgerService } from './stock-ledger/stock-ledger.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockLedger])],
  providers: [StockLedgerService],
  exports: [StockLedgerService],
})
export class StockLedgerEntitiesModule {}
