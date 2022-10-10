import { Test, TestingModule } from '@nestjs/testing';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';
import { SalesInvoiceAggregateService } from './sales-invoice-aggregate.service';
import { SalesInvoiceService } from '../../entity/sales-invoice/sales-invoice.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { HttpService } from '@nestjs/common';
import { SalesInvoicePoliciesService } from '../../../sales-invoice/policies/sales-invoice-policies/sales-invoice-policies.service';
import { DirectService } from '../../../direct/aggregates/direct/direct.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import { ItemService } from '../../../item/entity/item/item.service';
import { ItemAggregateService } from '../../../item/aggregates/item-aggregate/item-aggregate.service';
import { SerialNoHistoryPoliciesService } from '../../../serial-no/policies/serial-no-history-policies/serial-no-history-policies.service';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';
import { SerialNoPoliciesService } from '../../../serial-no/policies/serial-no-policies/serial-no-policies.service';

describe('SalesInvoiceAggregateService', () => {
  let service: SalesInvoiceAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesInvoiceAggregateService,
        {
          provide: StockLedgerService,
          useValue: {},
        },
        {
          provide: SalesInvoiceService,
          useValue: {},
        },
        {
          provide: SettingsService,
          useValue: {},
        },
        {
          provide: ErrorLogService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: SalesInvoicePoliciesService,
          useValue: {},
        },
        {
          provide: SerialNoService,
          useValue: {},
        },
        {
          provide: SerialNoPoliciesService,
          useValue: {},
        },
        {
          provide: DirectService,
          useValue: {},
        },
        {
          provide: ClientTokenManagerService,
          useValue: {},
        },
        {
          provide: SerialNoHistoryService,
          useValue: {},
        },
        {
          provide: ItemService,
          useValue: {},
        },
        {
          provide: ItemAggregateService,
          useValue: {},
        },
        {
          provide: SerialNoHistoryPoliciesService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SalesInvoiceAggregateService>(
      SalesInvoiceAggregateService,
    );
  });
  SalesInvoiceAggregateService;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
