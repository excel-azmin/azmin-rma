import { Test, TestingModule } from '@nestjs/testing';
import { ReturnVoucherService } from './return-voucher.service';
import { SettingsService } from '../../system-settings/aggregates/settings/settings.service';
import { HttpService } from '@nestjs/common';

describe('ReturnVoucherService', () => {
  let service: ReturnVoucherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReturnVoucherService,
        {
          provide: SettingsService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReturnVoucherService>(ReturnVoucherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
