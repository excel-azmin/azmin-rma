import { HttpModule, Module } from '@nestjs/common';
import { ServiceInvoiceEntitiesModule } from '../service-invoice/entity/entity.module';
import { PrintAggregateManager } from './aggregates';
import { PrintController } from './controller/print/print.controller';

@Module({
  imports: [HttpModule, ServiceInvoiceEntitiesModule],
  controllers: [PrintController],
  providers: [...PrintAggregateManager],
  exports: [],
})
export class PrintModule {}
