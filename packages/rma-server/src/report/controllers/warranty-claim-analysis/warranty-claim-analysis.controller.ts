import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { WarrantyClaimsListQueryDto } from '../../../constants/listing-dto/warranty-claims-list-query';
import { WarrantyClaimAnalysiAggregatesService } from '../../aggregates/warranty-claim-analysi-aggregates/warranty-claim-analysi-aggregates.service';

@Controller('warranty_claim_analysis')
export class WarrantyClaimAnalysisController {
  constructor(
    private readonly warrantyClaimAnalysiAggregatesService: WarrantyClaimAnalysiAggregatesService,
  ) {}

  @Get('v1/list')
  @UseGuards(FrappeWebhookGuard)
  async listWarrantyClaimAnalysis(@Query() query: WarrantyClaimsListQueryDto) {
    return await this.warrantyClaimAnalysiAggregatesService.getWarrantyClaimList(
      query,
    );
  }
}
