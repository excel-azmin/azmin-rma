import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrder } from './purchase-order.entity';

describe('PurchaseOrderService', () => {
  let service: PurchaseOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrderService,
        {
          provide: getRepositoryToken(PurchaseOrder),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PurchaseOrderService>(PurchaseOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
