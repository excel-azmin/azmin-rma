import { Test, TestingModule } from '@nestjs/testing';
import { SerialNoController } from './serial-no.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { SerialNoAggregateService } from '../../aggregates/serial-no-aggregate/serial-no-aggregate.service';

describe('SerialNo Controller', () => {
  let controller: SerialNoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SerialNoController],
      providers: [
        {
          provide: CommandBus,
          useValue: {},
        },
        {
          provide: QueryBus,
          useValue: {},
        },
        {
          provide: SerialNoAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<SerialNoController>(SerialNoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
