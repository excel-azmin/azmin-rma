import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseInvoiceAggregateService } from './purchase-invoice-aggregate.service';
import { PurchaseInvoiceService } from '../../entity/purchase-invoice/purchase-invoice.service';

describe('PurchaseInvoiceAggregateService', () => {
  let service: PurchaseInvoiceAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseInvoiceAggregateService,
        {
          provide: PurchaseInvoiceService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PurchaseInvoiceAggregateService>(
      PurchaseInvoiceAggregateService,
    );
  });
  PurchaseInvoiceAggregateService;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
