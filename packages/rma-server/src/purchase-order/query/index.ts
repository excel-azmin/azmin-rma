import { RetrievePurchaseOrderQuery } from './get-purchase-order/retrieve-purchase-order.query';
import { RetrievePurchaseOrderListQueryHandler } from './list-purchase-order/retrieve-purchase-order-list.handler';
import { RetrievePurchaseOrderQueryHandler } from './get-purchase-order/retrieve-purchase-order.handler';

export const PurchaseOrderQueries = [
  RetrievePurchaseOrderQuery,
  RetrievePurchaseOrderListQueryHandler,
  RetrievePurchaseOrderQueryHandler,
];
