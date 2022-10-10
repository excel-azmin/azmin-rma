import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { CustomerAggregateService } from './customer-aggregate.service';
import { CustomerService } from '../../entity/customer/customer.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';

describe('CustomerAggregateService', () => {
  let service: CustomerAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerAggregateService,
        { provide: CustomerService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
        { provide: SettingsService, useValue: {} },
      ],
    }).compile();

    service = module.get<CustomerAggregateService>(CustomerAggregateService);
  });
  CustomerAggregateService;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
