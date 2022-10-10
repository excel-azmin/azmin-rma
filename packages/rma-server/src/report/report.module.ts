import { Module } from '@nestjs/common';
import { WarrantyClaimAnalysisController } from './controllers/warranty-claim-analysis/warranty-claim-analysis.controller';
import { WarrantyClaimAnalysiAggregatesService } from './aggregates/warranty-claim-analysi-aggregates/warranty-claim-analysi-aggregates.service';
import { WarrantyClaimModule } from '../warranty-claim/warranty-claim.module';

@Module({
  controllers: [WarrantyClaimAnalysisController],
  imports: [WarrantyClaimModule],
  providers: [WarrantyClaimAnalysiAggregatesService],
})
export class ReportModule {}
