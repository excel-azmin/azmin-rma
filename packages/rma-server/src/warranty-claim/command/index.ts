import { AddWarrantyClaimCommandHandler } from './add-warranty-claim/add-warranty-claim.handler';
import { RemoveWarrantyClaimCommandHandler } from './remove-warranty-claim/remove-warranty-claim.handler';
import { UpdateWarrantyClaimCommandHandler } from './update-warranty-claim/update-warranty-claim.handler';
import { AddStatusHistoryCommandHandler } from './add-status-history/add-status-history.handler';
import { RemoveStatusHistoryCommandHandler } from './remove-status-history/remove-status-history.handler';
import { ResetWarrantyClaimCommandHandler } from './reset-warranty-claim/reset-warranty-claim.handler';

export const WarrantyClaimCommandManager = [
  AddWarrantyClaimCommandHandler,
  RemoveWarrantyClaimCommandHandler,
  UpdateWarrantyClaimCommandHandler,
  AddStatusHistoryCommandHandler,
  RemoveStatusHistoryCommandHandler,
  ResetWarrantyClaimCommandHandler,
];
