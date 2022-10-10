import { Test, TestingModule } from '@nestjs/testing';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';
import { DirectService } from '../../../direct/aggregates/direct/direct.service';
import { HttpService } from '@nestjs/common';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { DeliveryNoteJobHelperService } from './delivery-note-job-helper.service';
import { SalesInvoiceService } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.service';
import { AgendaJobService } from '../../../sync/entities/agenda-job/agenda-job.service';

describe('DeliveryNoteJobHelperService', () => {
  let service: DeliveryNoteJobHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryNoteJobHelperService,
        { provide: AGENDA_TOKEN, useValue: {} },
        {
          provide: DirectService,
          useValue: {},
        },
        {
          provide: AgendaJobService,
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
          provide: SerialNoService,
          useValue: {},
        },
        {
          provide: SalesInvoiceService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DeliveryNoteJobHelperService>(
      DeliveryNoteJobHelperService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
