import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurchaseReceiptService } from './purchase-receipt.service';
import { PurchaseReceipt } from './purchase-receipt.entity';

describe('PurchaseReceipt', () => {
  let service: PurchaseReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseReceiptService,
        {
          provide: getRepositoryToken(PurchaseReceipt),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PurchaseReceiptService>(PurchaseReceiptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
