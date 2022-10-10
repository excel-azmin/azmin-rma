import {
  Controller,
  Get,
  UseGuards,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  Req,
  Post,
} from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { QueryBus } from '@nestjs/cqrs';
import { RetrievePurchaseOrderQuery } from '../../query/get-purchase-order/retrieve-purchase-order.query';
import { RetrievePurchaseOrderListQuery } from '../../query/list-purchase-order/retrieve-purchase-order-list.query';
import { PurchaseOrderListQueryDto } from '../../../constants/listing-dto/purchase-order-list-query';
import { PurchaseOrderAggregateService } from '../../aggregates/purchase-order-aggregate/purchase-order-aggregate.service';

@Controller('purchase_order')
export class PurchaseOrderController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly purchaseOrderAggregate: PurchaseOrderAggregateService,
  ) {}

  @Get('v1/get/:uuid')
  @UseGuards(TokenGuard)
  async getClient(@Param('uuid') uuid: string) {
    return await this.queryBus.execute(
      new RetrievePurchaseOrderQuery({ uuid }),
    );
  }

  @Get('v1/get_po_from_pi_number/:name')
  @UseGuards(TokenGuard)
  async getPObyPINumber(@Param('name') name: string) {
    return await this.queryBus.execute(
      new RetrievePurchaseOrderQuery({ purchase_invoice_name: name }),
    );
  }

  @Post('v1/reset_order/:name')
  @UseGuards(TokenGuard)
  async resetOrder(@Param('name') name: string, @Req() req) {
    return await this.purchaseOrderAggregate.resetOrder(name, req);
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async getPurchaseInvoiceList(@Query() query: PurchaseOrderListQueryDto) {
    const { offset, limit, sort, filter_query } = query;
    let filter;
    try {
      filter = JSON.parse(filter_query);
    } catch {
      filter;
    }
    return await this.queryBus.execute(
      new RetrievePurchaseOrderListQuery(offset, limit, sort, filter),
    );
  }
}
