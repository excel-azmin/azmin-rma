import { Test, TestingModule } from '@nestjs/testing';
import { SupplierWebhookController } from './supplier-webhook.controller';
import { SupplierWebhookAggregateService } from '../../aggregates/supplier-webhook-aggregate/supplier-webhook-aggregate.service';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

describe('supplierWebhook Controller', () => {
  let controller: SupplierWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierWebhookController],
      providers: [
        {
          provide: SupplierWebhookAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(FrappeWebhookGuard)
      .useValue({})
      .overrideGuard(FrappeWebhookPipe)
      .useValue({})
      .compile();

    controller = module.get<SupplierWebhookController>(
      SupplierWebhookController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
