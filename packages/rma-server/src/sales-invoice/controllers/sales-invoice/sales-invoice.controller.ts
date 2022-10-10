import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  Body,
  ValidationPipe,
  Req,
  Param,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { SalesInvoiceDto } from '../../entity/sales-invoice/sales-invoice-dto';
import { SalesInvoiceUpdateDto } from '../../entity/sales-invoice/sales-invoice-update-dto';
import { AddSalesInvoiceCommand } from '../../command/add-sales-invoice/add-sales-invoice.command';
import { RemoveSalesInvoiceCommand } from '../../command/remove-sales-invoice/remove-sales-invoice.command';
import { UpdateSalesInvoiceCommand } from '../../command/update-sales-invoice/update-sales-invoice.command';
import { RetrieveSalesInvoiceListQuery } from '../../query/list-sales-invoice/retrieve-sales-invoice-list.query';
import { RetrieveSalesInvoiceQuery } from '../../query/get-sales-invoice/retrieve-sales-invoice.query';
import { SubmitSalesInvoiceCommand } from '../../command/submit-sales-invoice/submit-sales-invoice.command';
import { CreateSalesReturnCommand } from '../../command/create-sales-return/create-sales-return.command';
import { CreateSalesReturnDto } from '../../entity/sales-invoice/sales-return-dto';
import { SalesInvoiceListQueryDto } from '../../../constants/listing-dto/sales-invoice-list-query';
import { SalesInvoiceAggregateService } from '../../aggregates/sales-invoice-aggregate/sales-invoice-aggregate.service';
import { SalesInvoiceResetAggregateService } from '../../aggregates/sales-invoice-reset-aggregate/sales-invoice-reset-aggregate.service';
import { SalesReturnCancelDto } from '../../../sales-invoice/entity/sales-invoice/sales-return-cancel-dto';
import { CancelSalesReturnCommand } from '../../../sales-invoice/command/cancel-sales-return/cancel-sales-return.command';

@Controller('sales_invoice')
export class SalesInvoiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly salesInvoiceAggregate: SalesInvoiceAggregateService,
    private readonly salesInvoiceResetAggregate: SalesInvoiceResetAggregateService,
  ) {}

  @Post('v1/create')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() salesInvoicePayload: SalesInvoiceDto, @Req() req) {
    return await this.commandBus.execute(
      new AddSalesInvoiceCommand(salesInvoicePayload, req),
    );
  }

  @Post('v1/remove/:uuid')
  @UseGuards(TokenGuard)
  remove(@Param('uuid') uuid) {
    return this.commandBus.execute(new RemoveSalesInvoiceCommand(uuid));
  }

  @Post('v1/update')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateClient(@Body() updatePayload: SalesInvoiceUpdateDto, @Req() req) {
    return await this.commandBus.execute(
      new UpdateSalesInvoiceCommand(updatePayload, req),
    );
  }

  @Post('v1/submit/:uuid')
  @UseGuards(TokenGuard)
  @UsePipes()
  submitSalesInvoice(@Param('uuid') uuid: string, @Req() req) {
    return this.commandBus.execute(new SubmitSalesInvoiceCommand(uuid, req));
  }

  @Post('v1/cancel/:uuid')
  @UseGuards(TokenGuard)
  cancelSalesInvoice(@Param('uuid') uuid: string, @Req() req) {
    return this.salesInvoiceResetAggregate.cancel(uuid, req);
  }

  @Put('v1/cancel_return/:creditNoteName')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe())
  cancelSalesReturn(@Body() cancelReturnDto: SalesReturnCancelDto, @Req() req) {
    return this.commandBus.execute(
      new CancelSalesReturnCommand(cancelReturnDto, req),
    );
  }

  @Get('v1/get/:uuid')
  @UseGuards(TokenGuard)
  async getSalesInvoice(@Param('uuid') uuid, @Req() req) {
    return await this.queryBus.execute(
      new RetrieveSalesInvoiceQuery(uuid, req),
    );
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async listSalesInvoice(@Query() query: SalesInvoiceListQueryDto, @Req() req) {
    const { offset, limit, sort, filter_query } = query;
    let filter = {};
    try {
      filter = JSON.parse(filter_query);
    } catch {
      filter;
    }
    return await this.queryBus.execute(
      new RetrieveSalesInvoiceListQuery(offset, limit, sort, filter, req),
    );
  }

  @Post('v1/create_return')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createReturn(@Body() createReturnPayload: CreateSalesReturnDto, @Req() req) {
    return this.commandBus.execute(
      new CreateSalesReturnCommand(createReturnPayload, req),
    );
  }

  @Post('v1/update_outstanding_amount/:name')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateOutstandingAmount(@Param('name') invoice_name: string) {
    return await this.salesInvoiceAggregate
      .updateOutstandingAmount(invoice_name)
      .toPromise();
  }

  @Post('v1/update_delivery_status')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateDeliveryStatus(@Body() payload) {
    return await this.salesInvoiceAggregate.updateDeliveryStatus(payload);
  }

  @Post('v1/update_mrp_rate/:name')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateSalesInvoiceItemMRPRate(
    @Param('name') invoice_name: string,
    @Req() req,
  ) {
    return this.salesInvoiceAggregate.updateSalesInvoiceItemMRPRate(
      invoice_name,
      req,
    );
  }
}
