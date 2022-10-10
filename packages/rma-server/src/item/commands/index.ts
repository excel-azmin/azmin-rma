import { SetMinimumItemPriceHandler } from './set-minimum-item-price/set-minimum-item-price.handler';
import { SetWarrantyMonthsHandler } from './set-purchase-warranty-days/set-purchase-warranty-days.handler';

export const ItemCommandHandlers = [
  SetMinimumItemPriceHandler,
  SetWarrantyMonthsHandler,
];
