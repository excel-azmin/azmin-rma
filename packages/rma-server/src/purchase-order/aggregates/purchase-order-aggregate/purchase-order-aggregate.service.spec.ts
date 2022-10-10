import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderAggregateService } from './purchase-order-aggregate.service';
import { PurchaseOrderService } from '../../entity/purchase-order/purchase-order.service';
import { HttpService } from '@nestjs/common';
import { PurchaseInvoiceService } from '../../../purchase-invoice/entity/purchase-invoice/purchase-invoice.service';
import { PurchaseOrderPoliciesService } from '../../policies/purchase-order-policies/purchase-order-policies.service';
import { SerialNoHistoryService } from '../../../serial-no/entity/serial-no-history/serial-no-history.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { PurchaseReceiptService } from '../../../purchase-receipt/entity/purchase-receipt.service';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';

describe('PurchaseOrderAggregateService', () => {
  let service: PurchaseOrderAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrderAggregateService,
        { provide: PurchaseOrderService, useValue: {} },
        {
          provide: PurchaseOrderPoliciesService,
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
        {
          provide: SerialNoService,
          useValue: {},
        },
        {
          provide: PurchaseInvoiceService,
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
          provide: PurchaseReceiptService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PurchaseOrderAggregateService>(
      PurchaseOrderAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
