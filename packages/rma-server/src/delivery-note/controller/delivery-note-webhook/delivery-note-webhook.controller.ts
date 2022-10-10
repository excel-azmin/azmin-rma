import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
/* eslint-disable */
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

import { DeliveryNoteWebhookDto } from '../../../delivery-note/entity/delivery-note-service/delivery-note-webhook.dto';
import { DeliveryNoteWebhookAggregateService } from '../../../delivery-note/aggregates/delivery-note-webhook-aggregate/delivery-note-webhook-aggregate.service';
/* eslint-enable */

@Controller('delivery_note')
export class DeliveryNoteWebhookController {
  constructor(
    private readonly deliveryNoteAggregateService: DeliveryNoteWebhookAggregateService,
  ) {}

  @Post('webhook/v1/create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  createdDeliveryNote(@Body() deliveryNotePayload: DeliveryNoteWebhookDto) {
    return this.deliveryNoteAggregateService.createdDeliveryNote(
      deliveryNotePayload,
    );
  }

  @Post('webhook/v1/update')
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updatedDeliveryNote(@Body() deliveryNotePayload: DeliveryNoteWebhookDto) {
    return 'update coming soon';
  }

  @Post('webhook/v1/delete')
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  deletedDeliveryNote(@Body() deliveryNotePayload: DeliveryNoteWebhookDto) {
    return 'coming soon';
  }
}
