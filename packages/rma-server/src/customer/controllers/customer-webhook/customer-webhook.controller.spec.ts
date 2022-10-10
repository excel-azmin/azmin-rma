import { Test, TestingModule } from '@nestjs/testing';
import { CustomerWebhookController } from './customer-webhook.controller';
import { CustomerWebhookAggregateService } from '../../aggregates/customer-webhook-aggregate/customer-webhook-aggregate.service';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

describe('CustomerWebhook Controller', () => {
  let controller: CustomerWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerWebhookController],
      providers: [
        {
          provide: CustomerWebhookAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(FrappeWebhookGuard)
      .useValue({})
      .overrideGuard(FrappeWebhookPipe)
      .useValue({})
      .compile();

    controller = module.get<CustomerWebhookController>(
      CustomerWebhookController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
