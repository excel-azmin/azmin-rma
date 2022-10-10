import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryNoteWebhookAggregateService } from './delivery-note-webhook-aggregate.service';
import { DeliveryNoteService } from '../../../delivery-note/entity/delivery-note-service/delivery-note.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { HttpService } from '@nestjs/common';

describe('DeliveryNoteWebhookAggregateService', () => {
  let service: DeliveryNoteWebhookAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryNoteWebhookAggregateService,
        {
          provide: DeliveryNoteService,
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
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DeliveryNoteWebhookAggregateService>(
      DeliveryNoteWebhookAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
