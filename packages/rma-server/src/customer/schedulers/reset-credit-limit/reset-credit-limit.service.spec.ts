import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { ResetCreditLimitService } from './reset-credit-limit.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { CustomerService } from '../../entity/customer/customer.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';

describe('ResetCreditLimitService', () => {
  let service: ResetCreditLimitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResetCreditLimitService,
        { provide: SettingsService, useValue: {} },
        { provide: CustomerService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: AGENDA_TOKEN, useValue: {} },
      ],
    }).compile();

    service = module.get<ResetCreditLimitService>(ResetCreditLimitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
