import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { PurchaseInvoice } from './purchase-invoice.entity';

describe('purchaseInvoiceService', () => {
  let service: PurchaseInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseInvoiceService,
        {
          provide: getRepositoryToken(PurchaseInvoice),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PurchaseInvoiceService>(PurchaseInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
