import { RetrieveSerialNoHandler } from './get-serial-no/retrieve-serial-no-query.handler';
import { RetrieveSerialNoListHandler } from './list-serial-no/retrieve-serial-no-list-query.handler';
import { ValidateSerialsHandler } from './validate-serial/validate-serial-query.handler';
import { RetrieveDirectSerialNoHandler } from './get-direct-serial-no/retrieve-direct-serial-no-query.handler';
import { RetrieveSerialNoHistoryHandler } from './get-serial-no-history/get-serial-no-history-query.handler';
import { RetrieveSalesInvoiceDeliveredSerialNoQueryHandler } from './retrieve-sales-invoice-delivered-serial-no/retrieve-sales-invoice-delivered-serial-no.query.handler'; // eslint-disable-line
import { RetrieveSalesInvoiceReturnedSerialNoQueryHandler } from './retrieve-sales-invoice-return-serial-no/retrieve-sales-invoice-return-serial-no.query.handler'; // eslint-disable-line

export const SerialNoQueryManager = [
  RetrieveSerialNoHandler,
  RetrieveSerialNoListHandler,
  RetrieveSerialNoHistoryHandler,
  ValidateSerialsHandler,
  RetrieveDirectSerialNoHandler,
  RetrieveSalesInvoiceReturnedSerialNoQueryHandler,
  RetrieveSalesInvoiceDeliveredSerialNoQueryHandler,
];
