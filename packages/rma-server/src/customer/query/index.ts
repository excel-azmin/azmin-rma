import { RetrieveCustomerHandler } from './get-customer/retrieve-customer-query.handler';
import { RetrieveCustomerListHandler } from './list-customer/retrieve-customer-list-query.handler';

export const CustomerQueryManager = [
  RetrieveCustomerHandler,
  RetrieveCustomerListHandler,
];
