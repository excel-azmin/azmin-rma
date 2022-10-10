import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseInvoicePoliciesService } from './purchase-invoice-policies.service';

describe('PurchaseInvoicePoliciesService', () => {
  let service: PurchaseInvoicePoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseInvoicePoliciesService],
    }).compile();

    service = module.get<PurchaseInvoicePoliciesService>(
      PurchaseInvoicePoliciesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
