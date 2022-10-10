import {
  HealthIndicatorFunction,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { DEFAULT } from '../../../constants/typeorm.connection';

export const HEALTH_ENDPOINT = '/api/healthz';

@Injectable()
export class HealthCheckAggregateService {
  constructor(
    @InjectConnection(DEFAULT)
    private readonly typeormConnection: Connection,
    private readonly database: TypeOrmHealthIndicator,
  ) {}

  createTerminusOptions(): HealthIndicatorFunction[] {
    const healthEndpoint: HealthIndicatorFunction[] = [
      async () =>
        this.database.pingCheck('database', {
          connection: this.typeormConnection,
        }),
    ];
    return healthEndpoint;
  }
}
