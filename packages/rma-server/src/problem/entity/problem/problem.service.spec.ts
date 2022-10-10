import { Test, TestingModule } from '@nestjs/testing';
import { ProblemService } from './problem.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Problem } from './problem-entity';

describe('ProblemService', () => {
  let service: ProblemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProblemService,
        {
          provide: getRepositoryToken(Problem),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProblemService>(ProblemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
