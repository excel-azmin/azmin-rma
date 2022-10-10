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
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { ServiceInvoiceDto } from '../../entity/service-invoice/service-invoice-dto';
import { AddServiceInvoiceCommand } from '../../command/add-service-invoice/add-service-invoice.command';
import { RemoveServiceInvoiceCommand } from '../../command/remove-service-invoice/remove-service-invoice.command';
import { UpdateServiceInvoiceCommand } from '../../command/update-service-invoice/update-service-invoice.command';
import { RetrieveServiceInvoiceQuery } from '../../query/get-service-invoice/retrieve-service-invoice.query';
import { RetrieveServiceInvoiceListQuery } from '../../query/list-service-invoice/retrieve-service-invoice-list.query';
import { UpdateServiceInvoiceDto } from '../../entity/service-invoice/update-service-invoice-dto';
import { ServiceInvoiceAggregateService } from '../../../service-invoice/aggregates/service-invoice-aggregate/service-invoice-aggregate.service';

@Controller('service_invoice')
export class ServiceInvoiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly serviceInvoiceAggregate: ServiceInvoiceAggregateService,
  ) {}

  @Post('v1/create')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() serviceInvoicePayload: ServiceInvoiceDto, @Req() req) {
    return this.commandBus.execute(
      new AddServiceInvoiceCommand(serviceInvoicePayload, req),
    );
  }

  @Post('v1/remove/:uuid')
  @UseGuards(TokenGuard)
  remove(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new RemoveServiceInvoiceCommand(uuid));
  }

  @Get('v1/get/:uuid')
  @UseGuards(TokenGuard)
  async getServiceInvoice(@Param('uuid') uuid: string, @Req() req) {
    return await this.queryBus.execute(
      new RetrieveServiceInvoiceQuery(uuid, req),
    );
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  getServiceInvoiceList(
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('sort') sort,
    @Req() clientHttpRequest,
  ) {
    if (sort !== 'ASC') {
      sort = 'DESC';
    }
    try {
      search = decodeURIComponent(search);
    } catch {}
    return this.queryBus.execute(
      new RetrieveServiceInvoiceListQuery(
        offset,
        limit,
        sort,
        search,
        clientHttpRequest,
      ),
    );
  }

  @Post('v1/update')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateServiceInvoice(@Body() updatePayload: UpdateServiceInvoiceDto) {
    return this.commandBus.execute(
      new UpdateServiceInvoiceCommand(updatePayload),
    );
  }

  @Post('v1/sync_with_ERP/:invoice_no')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateDocStatus(@Param('invoice_no') invoice_no: string) {
    return this.serviceInvoiceAggregate.syncWithERP(invoice_no);
  }
}
