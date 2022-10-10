import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderWebhookAggregateService } from './purchase-order-webhook-aggregate.service';
import { HttpService } from '@nestjs/common';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { PurchaseOrderService } from '../../entity/purchase-order/purchase-order.service';
import { DirectService } from '../../../direct/aggregates/direct/direct.service';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';

describe('PurchaseOrderWebhookAggregateService', () => {
  let service: PurchaseOrderWebhookAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrderWebhookAggregateService,
        {
          provide: PurchaseOrderService,
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
        {
          provide: ClientTokenManagerService,
          useValue: {},
        },
        { provide: DirectService, useValue: {} },
        { provide: ErrorLogService, useValue: {} },
      ],
    }).compile();

    service = module.get<PurchaseOrderWebhookAggregateService>(
      PurchaseOrderWebhookAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
