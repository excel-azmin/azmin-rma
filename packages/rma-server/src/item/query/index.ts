import { RetrieveItemHandler } from './get-item/retrieve-item-query.handler';
import { RetrieveItemListHandler } from './list-item/retrieve-item-list-query.handler';
import { RetrieveItemByCodeHandler } from './get-item-by-code/retrieve-item-by-code-query.handler';
import { RetrieveItemByNamesHandler } from './get-item-by-names/retrieve-item-by-names-query.handler';

export const ItemQueryManager = [
  RetrieveItemHandler,
  RetrieveItemListHandler,
  RetrieveItemByCodeHandler,
  RetrieveItemByNamesHandler,
];
