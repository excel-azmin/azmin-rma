import { RetrieveWarrantyClaimQueryHandler } from './get-warranty-claim/retrieve-warranty-claim.handler';
import { RetrieveWarrantyClaimListQueryHandler } from './list-warranty-claim/retrieve-warranty-claim-list.handler';

export const WarrantyClaimQueryManager = [
  RetrieveWarrantyClaimQueryHandler,
  RetrieveWarrantyClaimListQueryHandler,
];
