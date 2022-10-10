import { Test, TestingModule } from '@nestjs/testing';
import { WarrantyStockEntryAggregateService } from './warranty-stock-entry-aggregate.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { HttpService } from '@nestjs/common';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import { StockEntryService } from '../../entities/stock-entry.service';
import { WarrantyClaimService } from '../../../warranty-claim/entity/warranty-claim/warranty-claim.service';
import { StockEntryPoliciesService } from '../../../stock-entry/policies/stock-entry-policies/stock-entry-policies.service';
import { WarrantyClaimAggregateService } from '../../../warranty-claim/aggregates/warranty-claim-aggregate/warranty-claim-aggregate.service';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';

describe('WarrantyStockEntryAggregateService', () => {
  let service: WarrantyStockEntryAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarrantyStockEntryAggregateService,
        {
          provide: StockEntryService,
          useValue: {},
        },
        {
          provide: SettingsService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: SerialNoService,
          useValue: {},
        },
        { provide: SerialNoHistoryService, useValue: {} },
        {
          provide: WarrantyClaimService,
          useValue: {},
        },
        {
          provide: StockEntryPoliciesService,
          useValue: {},
        },
        {
          provide: WarrantyClaimAggregateService,
          useValue: {},
        },
        {
          provide: StockLedgerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WarrantyStockEntryAggregateService>(
      WarrantyStockEntryAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
