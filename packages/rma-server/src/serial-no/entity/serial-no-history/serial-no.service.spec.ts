import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SerialNoHistoryService } from './serial-no-history.service';
import { SerialNoHistory } from './serial-no-history.entity';

describe('SerialNoService', () => {
  let service: SerialNoHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SerialNoHistoryService,
        {
          provide: getRepositoryToken(SerialNoHistory),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SerialNoHistoryService>(SerialNoHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
