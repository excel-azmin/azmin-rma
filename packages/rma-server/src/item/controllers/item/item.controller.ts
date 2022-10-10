import {
  Controller,
  Req,
  Param,
  Get,
  Query,
  UseGuards,
  Post,
  Body,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { RetrieveItemQuery } from '../../query/get-item/retrieve-item.query';
import { RetrieveItemListQuery } from '../../query/list-item/retrieve-item-list.query';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { SYSTEM_MANAGER } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { SetMinimumItemPriceCommand } from '../../commands/set-minimum-item-price/set-minimum-item-price.command';
import { RetrieveItemByCodeQuery } from '../../query/get-item-by-code/retrieve-item-by-code-.query';
import { RetrieveItemByNamesQuery } from '../../query/get-item-by-names/retrieve-item-by-names-.query';
import { INVALID_ITEM_NAME_QUERY } from '../../../constants/messages';
import { SetWarrantyMonthsCommand } from '../../commands/set-purchase-warranty-days/set-purchase-warranty-days.command';
import { SetWarrantyMonthsDto } from '../../entity/item/set-warranty-months-dto';
import { ItemAggregateService } from '../../aggregates/item-aggregate/item-aggregate.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { throwError } from 'rxjs';

@Controller('item')
export class ItemController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly aggregate: ItemAggregateService,
  ) {}

  @Get('v1/get/:uuid')
  @UseGuards(TokenGuard)
  async getItem(@Param('uuid') uuid, @Req() req) {
    return await this.queryBus.execute(new RetrieveItemQuery(uuid, req));
  }

  @Get('v1/get_by_item_code/:code')
  @UseGuards(TokenGuard)
  async getItemByCode(@Param('code') code, @Req() req) {
    return await this.queryBus.execute(new RetrieveItemByCodeQuery(code, req));
  }

  @Get('v1/get_by_names')
  @UseGuards(TokenGuard)
  async getItemByNames(@Query('item_names') item_names: string, @Req() req) {
    let query = [];
    try {
      query = JSON.parse(decodeURIComponent(item_names));
    } catch {
      throw new BadRequestException(INVALID_ITEM_NAME_QUERY);
    }
    return await this.queryBus.execute(
      new RetrieveItemByNamesQuery(query, req),
    );
  }

  @Get('v1/get_bundle_items')
  @UseGuards(TokenGuard)
  async getBundleItems(@Query('item_codes') item_codes: string) {
    // here item_codes will be hash like item-0001 : 11, where 11 is qty of item.
    let query = {};
    try {
      query = JSON.parse(decodeURIComponent(item_codes));
    } catch {
      throw new BadRequestException(`Please provide item_code as an array.`);
    }
    return await this.aggregate.getBundleItems(query);
  }

  @Get('v1/brand_list')
  @UseGuards(TokenGuard)
  async getBrand() {
    return await this.aggregate.getBrandList();
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  async getItemList(
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('sort') sort,
    @Req() clientHttpRequest,
  ) {
    try {
      search = decodeURIComponent(search);
    } catch {}
    return await this.queryBus.execute(
      new RetrieveItemListQuery(offset, limit, sort, search, clientHttpRequest),
    );
  }

  @Roles(SYSTEM_MANAGER)
  @Post('v1/set_minimum_item_price/:uuid')
  @UseGuards(TokenGuard, RoleGuard)
  async setMinimumItemPrice(
    @Param('uuid') uuid,
    @Body('minimumPrice') minimumPrice,
  ) {
    return await this.commandBus.execute(
      new SetMinimumItemPriceCommand(uuid, minimumPrice),
    );
  }

  @Roles(SYSTEM_MANAGER)
  @Post('v1/set_item_mrp/:uuid')
  @UseGuards(TokenGuard, RoleGuard)
  async set_item_mrp(@Param('uuid') uuid, @Body('mrp') mrp) {
    return await this.aggregate.set_item_mrp(uuid, mrp);
  }

  @Roles(SYSTEM_MANAGER)
  @Post('v1/update_has_serial')
  @UseGuards(TokenGuard, RoleGuard)
  async updateItemHasSerialNo(
    @Body('has_serial_no') has_serial_no,
    @Body('item_name') item_name,
  ) {
    if (![0, 1].includes(has_serial_no)) {
      throw new BadRequestException(
        'Has serial number should be either 1 or 0',
      );
    }
    return await this.aggregate.updateItemHasSerialNo(has_serial_no, item_name);
  }

  @Roles(SYSTEM_MANAGER)
  @Post('v1/set_warranty_months/:uuid')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(TokenGuard, RoleGuard)
  async setWarrantyMonths(
    @Param('uuid') uuid,
    @Body() payload: SetWarrantyMonthsDto,
  ) {
    return await this.commandBus.execute(
      new SetWarrantyMonthsCommand(uuid, payload),
    );
  }

  @Post('v1/sync_items')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  validateSerialNo(@UploadedFile('file') file, @Req() req) {
    if (!file) {
      return throwError(
        new BadRequestException(
          'Items file is mandatory, please provide list of items to sync.',
        ),
      );
    }
    return this.aggregate.syncItems(file, req);
  }
}
