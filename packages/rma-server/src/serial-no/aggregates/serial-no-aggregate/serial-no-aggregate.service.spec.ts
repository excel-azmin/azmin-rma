import { Test, TestingModule } from '@nestjs/testing';
import { SerialNoAggregateService } from './serial-no-aggregate.service';
import { SerialNoService } from '../../entity/serial-no/serial-no.service';
import { HttpService } from '@nestjs/common';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { SerialNoPoliciesService } from '../../policies/serial-no-policies/serial-no-policies.service';
import { AssignSerialNoPoliciesService } from '../../policies/assign-serial-no-policies/assign-serial-no-policies.service';
import { DeliveryNoteAggregateService } from '../../../delivery-note/aggregates/delivery-note-aggregate/delivery-note-aggregate.service';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';
import { SalesInvoiceService } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.service';
import { SerialNoHistoryService } from '../../entity/serial-no-history/serial-no-history.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';

describe('SerialNoAggregateService', () => {
  let service: SerialNoAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SerialNoAggregateService,
        {
          provide: SerialNoService,
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
          provide: SerialNoPoliciesService,
          useValue: {},
        },
        {
          provide: ErrorLogService,
          useValue: {},
        },
        {
          provide: AssignSerialNoPoliciesService,
          useValue: {},
        },
        {
          provide: DeliveryNoteAggregateService,
          useValue: {},
        },
        {
          provide: SalesInvoiceService,
          useValue: {},
        },
        {
          provide: SerialNoHistoryService,
          useValue: {},
        },
        {
          provide: ClientTokenManagerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SerialNoAggregateService>(SerialNoAggregateService);
  });
  SerialNoAggregateService;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
