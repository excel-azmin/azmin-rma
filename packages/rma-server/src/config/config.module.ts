import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from './config.service';
import { LuxonProvider } from './luxon.provider';

@Global()
@Module({
  providers: [ConfigService, Logger, LuxonProvider],
  exports: [ConfigService, Logger, LuxonProvider],
})
export class ConfigModule {}
