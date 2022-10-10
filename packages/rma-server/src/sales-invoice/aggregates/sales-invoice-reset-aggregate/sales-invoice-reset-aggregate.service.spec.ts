import { Test, TestingModule } from '@nestjs/testing';
import { SalesInvoiceResetAggregateService } from './sales-invoice-reset-aggregate.service';
import { SalesInvoiceService } from '../../entity/sales-invoice/sales-invoice.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { HttpService } from '@nestjs/common';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import { SalesInvoiceResetPoliciesService } from '../../policies/sales-invoice-reset-policies/sales-invoice-reset-policies.service';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';

describe('SalesInvoiceResetAggregateService', () => {
  let service: SalesInvoiceResetAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesInvoiceResetAggregateService,
        {
          provide: SalesInvoiceService,
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
          provide: SalesInvoiceResetPoliciesService,
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
          provide: StockLedgerService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SalesInvoiceResetAggregateService>(
      SalesInvoiceResetAggregateService,
    );
  });
  SalesInvoiceResetAggregateService;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
