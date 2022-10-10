import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AgendaJobService } from './agenda-job.service';
import { AgendaJob } from './agenda-job.entity';

describe('AgendaJobService', () => {
  let service: AgendaJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgendaJobService,
        {
          provide: getRepositoryToken(AgendaJob),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AgendaJobService>(AgendaJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
