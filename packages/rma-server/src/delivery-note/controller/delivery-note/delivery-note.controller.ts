import {
  Controller,
  Get,
  UseGuards,
  Req,
  Query,
  Param,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { DeliveryNoteAggregateService } from '../../aggregates/delivery-note-aggregate/delivery-note-aggregate.service';
import { CreateDeliveryNoteCommand } from '../../command/create-delivery-note/create-delivery-note.command';
import { DeleteDeliveryNoteCommand } from '../../command/delete-delivery-note/delete-delivery-note.command';

import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { RetriveDeliveryNoteQuery } from '../../queries/retrive-delivery-note/retrive-delivery-note.query';
import { UpdateDeliveryNoteDto } from '../../entity/delivery-note-service/update-delivery-note.dto';
import { UpdateDeliveryNoteCommand } from '../../commands/update-note/update-delivery-note.command';
import { CreateDeliveryNoteDto } from '../../entity/delivery-note-service/create-delivery-note.dto';
@Controller('delivery_note')
export class DeliveryNoteController {
  constructor(
    private readonly deliveryNoteAggregate: DeliveryNoteAggregateService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('v1/list')
  @UseGuards(TokenGuard)
  getDeliveryNote(
    @Req() req,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('sales_invoice') sales_invoice: string,
  ) {
    return this.deliveryNoteAggregate.listDeliveryNote(
      offset,
      limit,
      req,
      sales_invoice,
    );
  }

  @Get('v1/relay_list_warehouses')
  @UseGuards(TokenGuard, RoleGuard)
  relayListCompanies(@Query() query) {
    return this.deliveryNoteAggregate.relayListWarehouses(query);
  }

  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('v1/create')
  createDeliveryNote(@Body() payload: CreateDeliveryNoteDto) {
    return this.commandBus.execute(new CreateDeliveryNoteCommand(payload));
  }

  @UseGuards(TokenGuard)
  @Post('v1/delete/:uuid')
  deleteDeliveryNote(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteDeliveryNoteCommand(uuid));
  }

  @UseGuards(TokenGuard)
  @Get('v1/get/:uuid')
  getNote(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new RetriveDeliveryNoteQuery(uuid));
  }
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('v1/update')
  updateDeliveryNote(@Body() payload: UpdateDeliveryNoteDto) {
    return this.commandBus.execute(new UpdateDeliveryNoteCommand(payload));
  }
}
