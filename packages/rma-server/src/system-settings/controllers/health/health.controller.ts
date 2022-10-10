import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthCheckAggregateService } from '../../aggregates/health-check/health-check.service';

@Controller('healthz')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private checkService: HealthCheckAggregateService,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check(this.checkService.createTerminusOptions());
  }
}
