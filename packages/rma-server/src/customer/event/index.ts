import { CustomerAddedHandler } from './customer-added/customer-added-event.handler';
import { CustomerRemovedHandler } from './customer-removed/customer.removed-event.handler';
import { CustomerUpdatedHandler } from './customer-updated/customer-updated-event.handler';

export const CustomerEventManager = [
  CustomerAddedHandler,
  CustomerRemovedHandler,
  CustomerUpdatedHandler,
];
