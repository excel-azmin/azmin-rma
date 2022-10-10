import { ICommand } from '@nestjs/cqrs';

export class SubmitSalesInvoiceCommand implements ICommand {
  constructor(
    public readonly uuid: string,
    public readonly clientHttpReq: any,
  ) {}
}
