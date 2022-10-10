import { Test, TestingModule } from '@nestjs/testing';
import { WarrantyClaimAnalysiAggregatesService } from '../../aggregates/warranty-claim-analysi-aggregates/warranty-claim-analysi-aggregates.service';

import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { WarrantyClaimAnalysisController } from './warranty-claim-analysis.controller';

describe('WarrantyClaimAnalysisController', () => {
  let controller: WarrantyClaimAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarrantyClaimAnalysisController],
      providers: [
        {
          provide: WarrantyClaimAnalysiAggregatesService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(FrappeWebhookGuard)
      .useValue({})
      .compile();

    controller = module.get<WarrantyClaimAnalysisController>(
      WarrantyClaimAnalysisController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
