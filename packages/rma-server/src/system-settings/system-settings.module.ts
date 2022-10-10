import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { SettingsController } from './controllers/settings/settings.controller';
import { SetupController } from './controllers/setup/setup.controller';
import { SetupService } from './controllers/setup/setup.service';
import { SystemSettingsAggregates } from './aggregates';
import { ServerSettings } from './entities/server-settings/server-settings.entity';
import { DEFAULT } from '../constants/typeorm.connection';
import { ServerSettingsService } from './entities/server-settings/server-settings.service';
import { AgendaProvider } from './providers/agenda.provider';
import { HealthController } from './controllers/health/health.controller';
import { HealthCheckAggregateService } from './aggregates/health-check/health-check.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ServerSettings], DEFAULT),
    TerminusModule,
  ],
  providers: [
    SetupService,
    ServerSettingsService,
    ...SystemSettingsAggregates,
    AgendaProvider,
    HealthCheckAggregateService,
  ],
  controllers: [SettingsController, SetupController, HealthController],
  exports: [
    SetupService,
    ServerSettingsService,
    ...SystemSettingsAggregates,
    AgendaProvider,
  ],
})
export class SystemSettingsModule {}
