import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseInvoice } from './purchase-invoice/purchase-invoice.entity';
import { PurchaseInvoiceService } from './purchase-invoice/purchase-invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseInvoice])],
  providers: [PurchaseInvoiceService],
  exports: [PurchaseInvoiceService],
})
export class PurchaseInvoiceEntitiesModule {}
