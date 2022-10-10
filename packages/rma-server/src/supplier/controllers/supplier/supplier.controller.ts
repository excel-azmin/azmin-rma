import {
  Controller,
  Post,
  UsePipes,
  Body,
  ValidationPipe,
  Req,
  Param,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RetrieveSupplierQuery } from '../../query/get-supplier/retrieve-supplier.query';
import { RetrieveSupplierListQuery } from '../../query/list-supplier/retrieve-supplier-list.query';
import { SupplierDto } from '../../entity/supplier/supplier-dto';
import { AddSupplierCommand } from '../../command/add-supplier/add-supplier.command';
import { RemoveSupplierCommand } from '../../command/remove-supplier/remove-supplier.command';
import { UpdateSupplierCommand } from '../../command/update-supplier/update-supplier.command';
import { UpdateSupplierDto } from '../../entity/supplier/update-supplier-dto';

@Controller('supplier')
export class SupplierController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('v1/create')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() supplierPayload: SupplierDto, @Req() req) {
    return this.commandBus.execute(
      new AddSupplierCommand(supplierPayload, req),
    );
  }

  @Post('v1/remove/:uuid')
  @UseGuards(TokenGuard)
  remove(@Param('uuid') uuid) {
    return this.commandBus.execute(new RemoveSupplierCommand(uuid));
  }

  @Get('v1/get/:uuid')
  @UseGuards(TokenGuard)
  async getSupplier(@Param('uuid') uuid, @Req() req) {
    return await this.queryBus.execute(new RetrieveSupplierQuery(uuid, req));
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  getSupplierList(
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('sort') sort,
    @Req() clientHttpRequest,
  ) {
    if (sort !== 'ASC') {
      sort = 'DESC';
    }
    return this.queryBus.execute(
      new RetrieveSupplierListQuery(
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
  updateSupplier(@Body() updatePayload: UpdateSupplierDto) {
    return this.commandBus.execute(new UpdateSupplierCommand(updatePayload));
  }
}
