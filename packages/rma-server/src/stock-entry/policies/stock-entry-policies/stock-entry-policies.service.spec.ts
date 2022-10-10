import { Test, TestingModule } from '@nestjs/testing';
import { StockEntryPoliciesService } from './stock-entry-policies.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { SerialNoHistoryPoliciesService } from '../../../serial-no/policies/serial-no-history-policies/serial-no-history-policies.service';
import { AgendaJobService } from '../../../sync/entities/agenda-job/agenda-job.service';
import { HttpService } from '@nestjs/common';
import { SerialNoPoliciesService } from '../../../serial-no/policies/serial-no-policies/serial-no-policies.service';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';
import { WarrantyClaimService } from '../../../warranty-claim/entity/warranty-claim/warranty-claim.service';

describe('StockEntryPoliciesService', () => {
  let service: StockEntryPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockEntryPoliciesService,
        {
          provide: SerialNoService,
          useValue: {},
        },
        {
          provide: SerialNoPoliciesService,
          useValue: {},
        },
        {
          provide: AgendaJobService,
          useValue: {},
        },
        {
          provide: SettingsService,
          useValue: {},
        },
        {
          provide: SerialNoHistoryPoliciesService,
          useValue: {},
        },
        {
          provide: StockLedgerService,
          useValue: {},
        },
        {
          provide: WarrantyClaimService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<StockEntryPoliciesService>(StockEntryPoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
