import { Test, TestingModule } from '@nestjs/testing';
import { ProblemController } from './problem.controller';
import { ProblemAggregateService } from '../../aggregates/problem-aggregate/problem-aggregate.service';
import { TokenGuard } from '../../../auth/guards/token.guard';

describe('Problem Controller', () => {
  let controller: ProblemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProblemController],
      providers: [
        {
          provide: ProblemAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<ProblemController>(ProblemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
