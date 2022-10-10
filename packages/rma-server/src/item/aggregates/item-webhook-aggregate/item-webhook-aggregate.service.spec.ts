import { Test, TestingModule } from '@nestjs/testing';
import { ItemWebhookAggregateService } from './item-webhook-aggregate.service';
import { HttpService } from '@nestjs/common';
import { ItemService } from '../../entity/item/item.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';

describe('ItemWebhookAggregateService', () => {
  let service: ItemWebhookAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemWebhookAggregateService,
        {
          provide: ItemService,
          useValue: {},
        },
        {
          provide: ErrorLogService,
          useValue: {},
        },
        {
          provide: ClientTokenManagerService,
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
      ],
    }).compile();

    service = module.get<ItemWebhookAggregateService>(
      ItemWebhookAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
