import { Test, TestingModule } from '@nestjs/testing';
import { SalesInvoicePoliciesService } from './sales-invoice-policies.service';
import { CustomerService } from '../../../customer/entity/customer/customer.service';
import { SalesInvoiceService } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.service';
import { AssignSerialNoPoliciesService } from '../../../serial-no/policies/assign-serial-no-policies/assign-serial-no-policies.service';
import { HttpService } from '@nestjs/common';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { SerialNoPoliciesService } from '../../../serial-no/policies/serial-no-policies/serial-no-policies.service';
import { StockLedgerService } from '../../../stock-ledger/entity/stock-ledger/stock-ledger.service';

describe('SalesInvoicePoliciesService', () => {
  let service: SalesInvoicePoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesInvoicePoliciesService,
        {
          provide: StockLedgerService,
          useValue: {},
        },
        {
          provide: SalesInvoiceService,
          useValue: {},
        },
        {
          provide: CustomerService,
          useValue: {},
        },
        {
          provide: AssignSerialNoPoliciesService,
          useValue: {},
        },
        { provide: SerialNoPoliciesService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
        { provide: SettingsService, useValue: {} },
      ],
    }).compile();

    service = module.get<SalesInvoicePoliciesService>(
      SalesInvoicePoliciesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
