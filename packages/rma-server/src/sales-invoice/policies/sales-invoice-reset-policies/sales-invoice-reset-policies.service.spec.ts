import { Test, TestingModule } from '@nestjs/testing';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { SalesInvoiceResetPoliciesService } from './sales-invoice-reset-policies.service';
import { SerialNoHistoryPoliciesService } from '../../../serial-no/policies/serial-no-history-policies/serial-no-history-policies.service';
import { AgendaJobService } from '../../../sync/entities/agenda-job/agenda-job.service';

describe('SalesInvoiceResetPoliciesService', () => {
  let service: SalesInvoiceResetPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesInvoiceResetPoliciesService,
        {
          provide: SerialNoService,
          useValue: {},
        },
        {
          provide: SerialNoHistoryPoliciesService,
          useValue: {},
        },
        {
          provide: AgendaJobService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SalesInvoiceResetPoliciesService>(
      SalesInvoiceResetPoliciesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
