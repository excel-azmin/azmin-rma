import { Test, TestingModule } from '@nestjs/testing';
import { ProblemAggregateService } from './problem-aggregate.service';
import { ProblemService } from '../../entity/problem/problem.service';

describe('ProblemAggregateService', () => {
  let service: ProblemAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProblemAggregateService,
        {
          provide: ProblemService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProblemAggregateService>(ProblemAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
