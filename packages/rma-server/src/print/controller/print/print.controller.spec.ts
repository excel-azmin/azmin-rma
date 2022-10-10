import { Test, TestingModule } from '@nestjs/testing';
import { PrintAggregateService } from '../../aggregates/print-aggregate/print-aggregate.service';
import { PrintController } from '././print.controller';

describe('PrintController', () => {
  let controller: PrintController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrintController],
      providers: [
        {
          provide: PrintAggregateService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PrintController>(PrintController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
