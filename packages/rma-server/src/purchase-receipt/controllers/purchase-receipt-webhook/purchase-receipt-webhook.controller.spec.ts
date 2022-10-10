import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseReceiptWebhookController } from './purchase-receipt-webhook.controller';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { PurchaseReceiptAggregateService } from '../../aggregates/purchase-receipt-aggregate/purchase-receipt-aggregate.service';

describe('PurchaseReceiptWebhookController', () => {
  let controller: PurchaseReceiptWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseReceiptWebhookController],
      providers: [
        { provide: PurchaseReceiptAggregateService, useValue: {} },
        { provide: SettingsService, useValue: {} },
      ],
    })
      .overrideGuard(FrappeWebhookGuard)
      .useValue({})
      .overrideGuard(FrappeWebhookPipe)
      .useValue({})
      .compile();

    controller = module.get<PurchaseReceiptWebhookController>(
      PurchaseReceiptWebhookController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
