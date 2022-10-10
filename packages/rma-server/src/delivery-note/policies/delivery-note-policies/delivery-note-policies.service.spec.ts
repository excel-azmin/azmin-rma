import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryNotePoliciesService } from './delivery-note-policies.service';
import { SerialNoPoliciesService } from '../../../serial-no/policies/serial-no-policies/serial-no-policies.service';

describe('DeliveryNotePoliciesService', () => {
  let service: DeliveryNotePoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryNotePoliciesService,
        {
          provide: SerialNoPoliciesService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DeliveryNotePoliciesService>(
      DeliveryNotePoliciesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
