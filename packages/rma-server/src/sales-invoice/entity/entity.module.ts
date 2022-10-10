import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesInvoice } from './sales-invoice/sales-invoice.entity';
import { SalesInvoiceService } from './sales-invoice/sales-invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([SalesInvoice])],
  providers: [SalesInvoiceService],
  exports: [SalesInvoiceService],
})
export class SalesInvoiceEntitiesModule {}
