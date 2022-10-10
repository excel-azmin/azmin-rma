import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaJobService } from './agenda-job/agenda-job.service';
import { AgendaJob } from './agenda-job/agenda-job.entity';
import { JsonToCSVParserService } from './agenda-job/json-to-csv-parser.service';
import { DataImportService } from '../aggregates/data-import/data-import.service';
import { DirectModule } from '../../direct/direct.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AgendaJob]), DirectModule],
  providers: [DataImportService, JsonToCSVParserService, AgendaJobService],
  exports: [DataImportService, JsonToCSVParserService, AgendaJobService],
})
export class SyncEntitiesModule {}
