import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryNoteWebhookController } from './delivery-note-webhook.controller';
/* eslint-disable */
import { DeliveryNoteWebhookAggregateService } from '../../../delivery-note/aggregates/delivery-note-webhook-aggregate/delivery-note-webhook-aggregate.service';
/* eslint-enable */
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

describe('DeliveryNoteWebhook Controller', () => {
  let controller: DeliveryNoteWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryNoteWebhookController],
      providers: [
        {
          provide: DeliveryNoteWebhookAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(FrappeWebhookGuard)
      .useValue({})
      .overrideGuard(FrappeWebhookPipe)
      .useValue({})
      .compile();

    controller = module.get<DeliveryNoteWebhookController>(
      DeliveryNoteWebhookController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
