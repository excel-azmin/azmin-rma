import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderWebhookController } from './purchase-order-webhook.controller';
import { PurchaseOrderWebhookAggregateService } from '../../aggregates/purchase-order-webhook-aggregate/purchase-order-webhook-aggregate.service';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';

describe('PurchaseOrderWebhook Controller', () => {
  let controller: PurchaseOrderWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseOrderWebhookController],
      providers: [
        { provide: PurchaseOrderWebhookAggregateService, useValue: {} },
        { provide: SettingsService, useValue: {} },
      ],
    })
      .overrideGuard(FrappeWebhookGuard)
      .useValue({})
      .overrideGuard(FrappeWebhookPipe)
      .useValue({})
      .compile();

    controller = module.get<PurchaseOrderWebhookController>(
      PurchaseOrderWebhookController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
