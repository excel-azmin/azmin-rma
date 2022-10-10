import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SerialNoService } from './serial-no.service';
import { SerialNo } from './serial-no.entity';

describe('SerialNoService', () => {
  let service: SerialNoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SerialNoService,
        {
          provide: getRepositoryToken(SerialNo),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SerialNoService>(SerialNoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
