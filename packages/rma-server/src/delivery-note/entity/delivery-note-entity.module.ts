import { Module } from '@nestjs/common';
import { DeliveryNoteService } from './delivery-note-service/delivery-note.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryNote } from './delivery-note-service/delivery-note.entity';
import { SalesInvoiceEntitiesModule } from '../../sales-invoice/entity/entity.module';
import { SerialNoEntitiesModule } from '../../serial-no/entity/entity.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryNote]),
    SalesInvoiceEntitiesModule,
    SerialNoEntitiesModule,
  ],
  providers: [DeliveryNoteService],
  exports: [DeliveryNoteService],
})
export class DeliveryNoteEntitiesModule {}
