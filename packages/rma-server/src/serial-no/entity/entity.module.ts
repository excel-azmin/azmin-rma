import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SerialNo } from './serial-no/serial-no.entity';
import { SerialNoService } from './serial-no/serial-no.service';
import { SerialNoHistory } from './serial-no-history/serial-no-history.entity';
import { SerialNoHistoryService } from './serial-no-history/serial-no-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([SerialNo, SerialNoHistory])],
  providers: [SerialNoService, SerialNoHistoryService],
  exports: [SerialNoService, SerialNoHistoryService],
})
export class SerialNoEntitiesModule {}
