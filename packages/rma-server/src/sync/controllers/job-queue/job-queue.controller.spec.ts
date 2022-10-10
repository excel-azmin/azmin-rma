import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { JobQueueController } from './job-queue.controller';
import { JobQueueAggregateService } from '../../aggregates/job-queue-aggregate/job-queue-aggregate.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';
import { RoleGuard } from '../../../auth/guards/role.guard';

describe('JobQueue Controller', () => {
  let controller: JobQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobQueueController],
      providers: [
        { provide: JobQueueAggregateService, useValue: {} },
        {
          provide: TokenCacheService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .overrideGuard(FrappeWebhookGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .overrideGuard(FrappeWebhookPipe)
      .useValue({})
      .compile();

    controller = module.get<JobQueueController>(JobQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
