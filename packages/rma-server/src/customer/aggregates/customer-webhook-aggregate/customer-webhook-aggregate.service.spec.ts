import { Test, TestingModule } from '@nestjs/testing';
import { CustomerWebhookAggregateService } from './customer-webhook-aggregate.service';
import { CustomerService } from '../../entity/customer/customer.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { HttpService } from '@nestjs/common';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';

describe('CustomerWebhookAggregateService', () => {
  let service: CustomerWebhookAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerWebhookAggregateService,
        {
          provide: CustomerService,
          useValue: {},
        },
        {
          provide: ErrorLogService,
          useValue: {},
        },
        {
          provide: ClientTokenManagerService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: SettingsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CustomerWebhookAggregateService>(
      CustomerWebhookAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
