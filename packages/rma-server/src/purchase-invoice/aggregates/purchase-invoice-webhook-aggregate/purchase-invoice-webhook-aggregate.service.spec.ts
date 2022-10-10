import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseInvoiceWebhookAggregateService } from './purchase-invoice-webhook-aggregate.service';
import { PurchaseInvoiceService } from '../../entity/purchase-invoice/purchase-invoice.service';
import { HttpService } from '@nestjs/common';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { ItemService } from '../../../item/entity/item/item.service';
import { PurchaseOrderService } from '../../../purchase-order/entity/purchase-order/purchase-order.service';

describe('PurchaseInvoiceWebhookAggregateService', () => {
  let service: PurchaseInvoiceWebhookAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseInvoiceWebhookAggregateService,
        {
          provide: PurchaseInvoiceService,
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
        {
          provide: ItemService,
          useValue: {},
        },
        {
          provide: PurchaseOrderService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PurchaseInvoiceWebhookAggregateService>(
      PurchaseInvoiceWebhookAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
