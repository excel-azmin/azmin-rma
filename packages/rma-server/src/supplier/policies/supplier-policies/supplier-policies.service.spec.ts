import { Test, TestingModule } from '@nestjs/testing';
import { SupplierPoliciesService } from './supplier-policies.service';

describe('SupplierPoliciesService', () => {
  let service: SupplierPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierPoliciesService],
    }).compile();

    service = module.get<SupplierPoliciesService>(SupplierPoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
