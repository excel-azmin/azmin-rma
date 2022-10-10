import { Test, TestingModule } from '@nestjs/testing';
import { StockEntryAggregateService } from './stock-entry-aggregate.service';
import { StockEntryService } from '../../entities/stock-entry.service';
import { StockEntryPoliciesService } from '../../policies/stock-entry-policies/stock-entry-policies.service';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import { HttpService } from '@nestjs/common';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';
import { StockEntrySyncService } from '../../../stock-entry/schedular/stock-entry-sync/stock-entry-sync.service';

describe('StockEntryAggregateService', () => {
  let service: StockEntryAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockEntryAggregateService,
        {
          provide: StockLedgerService,
          useValue: {},
        },
        {
          provide: StockEntrySyncService,
          useValue: {},
        },
        {
          provide: StockEntryService,
          useValue: {},
        },
        {
          provide: StockEntryPoliciesService,
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
          provide: SerialNoHistoryService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        { provide: AGENDA_TOKEN, useValue: {} },
      ],
    }).compile();

    service = module.get<StockEntryAggregateService>(
      StockEntryAggregateService,
    );
  });
  StockEntryAggregateService;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
