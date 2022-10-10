import { WarrantyClaimAddedEventHandler } from './warranty-claim-added/warranty-claim-added.handler';
import { WarrantyClaimRemovedEventHandler } from './warranty-claim-removed/warranty-claim.removed.handler';
import { WarrantyClaimUpdatedEventHandler } from './warranty-claim-updated/warranty-claim-updated.handler';
import { BulkWarrantyClaimsCreatedHandler } from './bulk-warranty-claims-created/bulk-warranty-claims.handler';

export const WarrantyClaimEventManager = [
  WarrantyClaimAddedEventHandler,
  WarrantyClaimRemovedEventHandler,
  WarrantyClaimUpdatedEventHandler,
  BulkWarrantyClaimsCreatedHandler,
];
