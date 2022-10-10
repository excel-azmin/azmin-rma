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
import { AddCustomerCommand } from '../../command/add-customer/add-customer.command';
import { RemoveCustomerCommand } from '../../command/remove-customer/remove-customer.command';
import { UpdateCustomerCommand } from '../../command/update-customer/update-customer.command';
import { RetrieveCustomerQuery } from '../../query/get-customer/retrieve-customer.query';
import { RetrieveCustomerListQuery } from '../../query/list-customer/retrieve-customer-list.query';
import { CustomerDto } from '../../../customer/entity/customer/customer-dto';
import { UpdateCustomerDto } from '../../entity/customer/update-customer-dto';
import { UpdateCreditLimitDto } from '../../entity/customer/update-credit-limit.dto';
import { UpdateCreditLimitCommand } from '../../command/update-credit-limit/update-credit-limit.command';
import { CustomerAggregateService } from '../../aggregates/customer-aggregate/customer-aggregate.service';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly aggregate: CustomerAggregateService,
  ) {}

  @Post('v1/create')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() customerPayload: CustomerDto, @Req() req) {
    return this.commandBus.execute(
      new AddCustomerCommand(customerPayload, req),
    );
  }

  @Post('v1/remove/:uuid')
  @UseGuards(TokenGuard)
  remove(@Param('uuid') uuid) {
    return this.commandBus.execute(new RemoveCustomerCommand(uuid));
  }

  @Get('v1/get/:customer_name')
  @UseGuards(TokenGuard)
  async getCustomer(@Param('customer_name') name, @Req() req) {
    return await this.queryBus.execute(new RetrieveCustomerQuery(name, req));
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  async getCustomerList(
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('sort') sort: string,
    @Req() clientHttpRequest,
  ) {
    try {
      search = decodeURIComponent(search);
    } catch {}
    return await this.queryBus.execute(
      new RetrieveCustomerListQuery(
        offset,
        limit,
        search,
        sort,
        clientHttpRequest,
      ),
    );
  }

  @Post('v1/update')
  @UseGuards(TokenGuard)
  @UsePipes(ValidationPipe)
  async updateCustomer(@Body() updatePayload: UpdateCustomerDto) {
    return await this.commandBus.execute(
      new UpdateCustomerCommand(updatePayload),
    );
  }

  @Post('v1/update_credit_limit')
  @UseGuards(TokenGuard)
  @UsePipes(ValidationPipe)
  async updateCreditLimit(
    @Body() updatePayload: UpdateCreditLimitDto,
    @Req() req,
  ) {
    return await this.commandBus.execute(
      new UpdateCreditLimitCommand(updatePayload, req),
    );
  }

  @Get('v1/relay_list_customer')
  @UseGuards(TokenGuard)
  relayListCustomers(@Query() query) {
    return this.aggregate.relayListCustomers(query);
  }

  @Get('v1/relay_customer/:name')
  @UseGuards(TokenGuard)
  relayCustomer(@Param('name') name) {
    return this.aggregate.relayCustomer(name);
  }
}
