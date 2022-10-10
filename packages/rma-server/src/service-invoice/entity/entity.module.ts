import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceInvoice } from './service-invoice/service-invoice.entity';
import { ServiceInvoiceService } from './service-invoice/service-invoice.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceInvoice]), CqrsModule],
  providers: [ServiceInvoiceService],
  exports: [ServiceInvoiceService],
})
export class ServiceInvoiceEntitiesModule {}
