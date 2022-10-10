import { Module, Global } from '@nestjs/common';
import { ErrorLogController } from './controller/error-logs.controller';
import { ErrorLogService } from './error-log-service/error-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorLog } from './error-log-service/error-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ErrorLog])],
  controllers: [ErrorLogController],
  providers: [ErrorLogService],
  exports: [ErrorLogService],
})
export class ErrorLogModule {}
