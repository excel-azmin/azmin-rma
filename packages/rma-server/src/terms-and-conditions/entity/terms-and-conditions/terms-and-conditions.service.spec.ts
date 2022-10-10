import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TermsAndConditions } from './terms-and-conditions.entity';
import { TermsAndConditionsService } from './terms-and-conditions.service';

describe('TermsAndConditionsService', () => {
  let service: TermsAndConditionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TermsAndConditionsService,
        {
          provide: getRepositoryToken(TermsAndConditions),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TermsAndConditionsService>(TermsAndConditionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
