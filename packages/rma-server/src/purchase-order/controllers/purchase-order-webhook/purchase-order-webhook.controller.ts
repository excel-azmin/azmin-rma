import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

import { PurchaseOrderWebhookAggregateService } from '../../aggregates/purchase-order-webhook-aggregate/purchase-order-webhook-aggregate.service';
import { PurchaseOrderWebhookDto } from '../../entity/purchase-order/purchase-order-webhook-dto';

@Controller('purchase_order')
export class PurchaseOrderWebhookController {
  constructor(
    private readonly purchaseOrderWebhookAggregate: PurchaseOrderWebhookAggregateService,
  ) {}
  @Post('webhook/v1/create')
  @UsePipes(ValidationPipe)
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  purchaseInvoiceCreated(
    @Body() purchaseOrderPayload: PurchaseOrderWebhookDto,
  ) {
    return this.purchaseOrderWebhookAggregate.purchaseOrderCreated(
      purchaseOrderPayload,
    );
  }
}
