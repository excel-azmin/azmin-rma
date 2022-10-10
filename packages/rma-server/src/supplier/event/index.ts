import { SupplierAddedHandler } from './supplier-added/supplier-added-event.handler';
import { SupplierUpdatedHandler } from './supplier-updated/supplier-updated-event.handler';
import { SupplierRemovedHandler } from './supplier-removed/supplier.removed-event.handler';

export const SupplierEventManager = [
  SupplierAddedHandler,
  SupplierRemovedHandler,
  SupplierUpdatedHandler,
];
