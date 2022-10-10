import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInvoicePoliciesService } from './service-invoice-policies.service';

describe('ServiceInvoicePoliciesService', () => {
  let service: ServiceInvoicePoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceInvoicePoliciesService],
    }).compile();

    service = module.get<ServiceInvoicePoliciesService>(
      ServiceInvoicePoliciesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
