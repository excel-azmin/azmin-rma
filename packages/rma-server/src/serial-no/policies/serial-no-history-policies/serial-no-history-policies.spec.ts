import { Test, TestingModule } from '@nestjs/testing';
import { SerialNoHistoryPoliciesService } from './serial-no-history-policies.service';
import { SerialNoHistoryService } from '../../entity/serial-no-history/serial-no-history.service';

describe('SerialNoHistoryPoliciesService', () => {
  let service: SerialNoHistoryPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SerialNoHistoryPoliciesService,
        {
          provide: SerialNoHistoryService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SerialNoHistoryPoliciesService>(
      SerialNoHistoryPoliciesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
