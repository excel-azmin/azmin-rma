import { Test, TestingModule } from '@nestjs/testing';
import { ItemWebhookController } from './item-webhook.controller';
import { ItemWebhookAggregateService } from '../../aggregates/item-webhook-aggregate/item-webhook-aggregate.service';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

describe('ItemWebhookController', () => {
  let controller: ItemWebhookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemWebhookController],
      providers: [
        {
          provide: ItemWebhookAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(FrappeWebhookGuard)
      .useValue({})
      .overrideGuard(FrappeWebhookPipe)
      .useValue({})
      .compile();

    controller = module.get<ItemWebhookController>(ItemWebhookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
