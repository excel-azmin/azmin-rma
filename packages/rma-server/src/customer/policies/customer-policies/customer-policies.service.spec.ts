import { Test, TestingModule } from '@nestjs/testing';
import { CustomerPoliciesService } from './customer-policies.service';

describe('CustomerPoliciesService', () => {
  let service: CustomerPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerPoliciesService],
    }).compile();

    service = module.get<CustomerPoliciesService>(CustomerPoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
