import { Test, TestingModule } from '@nestjs/testing';
import { SerialBatchService } from './serial-batch.service';

describe('SerialBatchService', () => {
  let service: SerialBatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SerialBatchService],
    }).compile();

    service = module.get<SerialBatchService>(SerialBatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
