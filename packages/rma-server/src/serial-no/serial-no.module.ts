import { Module } from '@nestjs/common';
import { SerialNoAggregatesManager } from './aggregates';
import { SerialNoEntitiesModule } from './entity/entity.module';
import { SerialNoQueryManager } from './query';
import { SerialNoCommandManager } from './command';
import { SerialNoController } from './controllers/serial-no/serial-no.controller';
import { ItemEntitiesModule } from '../item/entity/item-entity.module';
import { SupplierEntitiesModule } from '../supplier/entity/entity.module';
import { SalesInvoiceEntitiesModule } from '../sales-invoice/entity/entity.module';
import { DeliveryNoteModule } from '../delivery-note/delivery-note.module';
import { DirectModule } from '../direct/direct.module';
import { SerialNoPolicies } from './policies';

@Module({
  imports: [
    SerialNoEntitiesModule,
    ItemEntitiesModule,
    SupplierEntitiesModule,
    SalesInvoiceEntitiesModule,
    DeliveryNoteModule,
    DirectModule,
  ],
  controllers: [SerialNoController],
  providers: [
    ...SerialNoAggregatesManager,
    ...SerialNoQueryManager,
    ...SerialNoCommandManager,
    ...SerialNoPolicies,
  ],
  exports: [
    SerialNoEntitiesModule,
    ...SerialNoAggregatesManager,
    ...SerialNoPolicies,
  ],
})
export class SerialNoModule {}
