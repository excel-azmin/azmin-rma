import { Test, TestingModule } from '@nestjs/testing';
import { TermsAndConditionsService } from '../../entity/terms-and-conditions/terms-and-conditions.service';
import { TermsAndConditionsAggregateService } from './terms-and-conditions-aggregate.service';

describe('TermsAndConditionsAggregateService', () => {
  let service: TermsAndConditionsAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TermsAndConditionsAggregateService,
        {
          provide: TermsAndConditionsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TermsAndConditionsAggregateService>(
      TermsAndConditionsAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
