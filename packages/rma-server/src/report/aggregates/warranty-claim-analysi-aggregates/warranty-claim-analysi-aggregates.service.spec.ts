import { Test, TestingModule } from '@nestjs/testing';
import { WarrantyClaimService } from '../../../warranty-claim/entity/warranty-claim/warranty-claim.service';
import { WarrantyClaimAnalysiAggregatesService } from './warranty-claim-analysi-aggregates.service';

describe('WarrantyClaimAnalysiAggregatesService', () => {
  let service: WarrantyClaimAnalysiAggregatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarrantyClaimAnalysiAggregatesService,
        {
          provide: WarrantyClaimService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WarrantyClaimAnalysiAggregatesService>(
      WarrantyClaimAnalysiAggregatesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
