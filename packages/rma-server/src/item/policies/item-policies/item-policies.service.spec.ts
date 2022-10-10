import { Test, TestingModule } from '@nestjs/testing';
import { ItemPoliciesService } from './item-policies.service';

describe('ItemPoliciesService', () => {
  let service: ItemPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemPoliciesService],
    }).compile();

    service = module.get<ItemPoliciesService>(ItemPoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
