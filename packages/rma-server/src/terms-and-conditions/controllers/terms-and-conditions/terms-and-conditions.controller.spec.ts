import { Test, TestingModule } from '@nestjs/testing';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { TermsAndConditionsAggregateService } from '../../aggregates/terms-and-conditions-aggregate/terms-and-conditions-aggregate.service';
import { TermsAndConditionsController } from './terms-and-conditions.controller';

describe('TermsAndConditionsController', () => {
  let controller: TermsAndConditionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TermsAndConditionsController],
      providers: [
        {
          provide: TermsAndConditionsAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<TermsAndConditionsController>(
      TermsAndConditionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
