import {
  Controller,
  UsePipes,
  ValidationPipe,
  Req,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PurchaseInvoiceListQueryDto } from '../../constants/listing-dto/purchase-invoice-list-query';
import { TokenGuard } from '../../auth/guards/token.guard';
import { StockLedgerAggregateService } from '../aggregates/stock-ledger-aggregate/stock-ledger-aggregate.service';

@Controller('stock_ledger')
export class StockLedgerController {
  constructor(private stockLedgerAggregate: StockLedgerAggregateService) {}

  @Get('v1/summary')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  getStockSummaryList(@Query() query: PurchaseInvoiceListQueryDto, @Req() req) {
    const { offset, limit, sort, filter_query } = query;
    let filter;
    try {
      filter = JSON.parse(filter_query);
    } catch {
      filter;
    }
    return this.stockLedgerAggregate.getStockSummaryList({
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      sort,
      filter,
    });
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async getPurchaseInvoiceList(@Query() query, @Req() req) {
    const { limit_start, limit_page_length, filters } = query;
    let filter;
    const sort = 'ASC';
    try {
      filter = JSON.parse(decodeURIComponent(filters));
    } catch {
      filter;
    }
    return await this.stockLedgerAggregate.getStockLedgerList(
      Number(limit_start) || 0,
      Number(limit_page_length) || 10,
      sort,
      filter,
      req,
    );
  }
  @Get('v1/list_count')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async getPurchaseInvoiceListCount(@Query() query, @Req() req) {
    const { limit_start, limit_page_length, filters } = query;
    let filter;
    const sort = 'ASC';
    try {
      filter = JSON.parse(filters);
    } catch {
      filter;
    }
    return await this.stockLedgerAggregate.getStockLedgerListCount(
      Number(limit_start) || 0,
      Number(limit_page_length) || 10,
      sort,
      filter,
      req,
    );
  }
}
