import { Test, TestingModule } from '@nestjs/testing';
/* eslint-disable */
import { PurchaseInvoiceWebhookController } from './purchase-invoice-webhook.controller';
import { PurchaseInvoiceWebhookAggregateService } from '../../../purchase-invoice/aggregates/purchase-invoice-webhook-aggregate/purchase-invoice-webhook-aggregate.service';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

/* eslint-enable */

describe('PurchaseInvoiceWebhook Controller', () => {
  let controller: PurchaseInvoiceWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PurchaseInvoiceWebhookAggregateService,
          useValue: {},
        },
      ],
      controllers: [PurchaseInvoiceWebhookController],
    })
      .overrideGuard(FrappeWebhookGuard)
      .useValue({})
      .overrideGuard(FrappeWebhookPipe)
      .useValue({})
      .compile();

    controller = module.get<PurchaseInvoiceWebhookController>(
      PurchaseInvoiceWebhookController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
