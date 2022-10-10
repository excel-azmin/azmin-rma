import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { WarrantyClaimService } from '../../../warranty-claim/entity/warranty-claim/warranty-claim.service';

@Injectable()
export class WarrantyClaimAnalysiAggregatesService extends AggregateRoot {
  constructor(private readonly warrantyClaimService: WarrantyClaimService) {
    super();
  }

  async getWarrantyClaimList(filter_query?) {
    return await this.warrantyClaimService.report(filter_query);
  }
}
