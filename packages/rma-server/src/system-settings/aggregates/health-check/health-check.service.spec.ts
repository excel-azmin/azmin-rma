import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import { Connection } from 'typeorm';
import { HealthCheckAggregateService } from './health-check.service';

describe('HealthCheckAggregateService', () => {
  let service: HealthCheckAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCheckAggregateService,
        { provide: Connection, useValue: {} },
        { provide: TypeOrmHealthIndicator, useValue: {} },
      ],
    }).compile();

    service = module.get<HealthCheckAggregateService>(
      HealthCheckAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
