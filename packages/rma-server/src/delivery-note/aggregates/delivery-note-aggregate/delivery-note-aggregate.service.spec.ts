import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { DeliveryNoteAggregateService } from './delivery-note-aggregate.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { SalesInvoiceService } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.service';
import { DeliveryNoteService } from '../../entity/delivery-note-service/delivery-note.service';
import { DeliveryNoteJobService } from '../../schedular/delivery-note-job/delivery-note-job.service';
import { SerialBatchService } from '../../../sync/aggregates/serial-batch/serial-batch.service';
import { DeliveryNotePoliciesService } from '../../../delivery-note/policies/delivery-note-policies/delivery-note-policies.service';

describe('DeliveryNoteAggregateService', () => {
  let service: DeliveryNoteAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryNoteAggregateService,
        { provide: SettingsService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
        { provide: SerialNoService, useValue: {} },
        { provide: SalesInvoiceService, useValue: {} },
        { provide: DeliveryNoteService, useValue: {} },
        { provide: DeliveryNoteJobService, useValue: {} },
        { provide: SerialBatchService, useValue: {} },
        { provide: DeliveryNotePoliciesService, useValue: {} },
      ],
    }).compile();

    service = module.get<DeliveryNoteAggregateService>(
      DeliveryNoteAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
