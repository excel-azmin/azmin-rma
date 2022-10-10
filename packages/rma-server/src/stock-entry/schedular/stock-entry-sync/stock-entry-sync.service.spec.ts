import { Test, TestingModule } from '@nestjs/testing';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';
import { DirectService } from '../../../direct/aggregates/direct/direct.service';
import { HttpService } from '@nestjs/common';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { StockEntrySyncService } from './stock-entry-sync.service';
import { StockEntryService } from '../../entities/stock-entry.service';
import { AgendaJobService } from '../../../sync/entities/agenda-job/agenda-job.service';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';

describe('StockEntryJobService', () => {
  let service: StockEntrySyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockEntrySyncService,
        { provide: AGENDA_TOKEN, useValue: {} },
        {
          provide: DirectService,
          useValue: {},
        },
        {
          provide: StockLedgerService,
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
          provide: StockEntryService,
          useValue: {},
        },
        {
          provide: SerialNoService,
          useValue: {},
        },
        { provide: SerialNoHistoryService, useValue: {} },
      ],
    }).compile();

    service = module.get<StockEntrySyncService>(StockEntrySyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
