import { RetrieveSupplierHandler } from './get-supplier/retrieve-supplier-query.handler';
import { RetrieveSupplierListHandler } from './list-supplier/retrieve-supplier-list-query.handler';

export const SupplierQueryManager = [
  RetrieveSupplierHandler,
  RetrieveSupplierListHandler,
];
