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

import { PurchaseReceiptAggregateService } from '../../aggregates/purchase-receipt-aggregate/purchase-receipt-aggregate.service';

@Controller('purchase_receipt')
export class PurchaseReceiptWebhookController {
  constructor(
    private readonly purchaseReceiptAggregate: PurchaseReceiptAggregateService,
  ) {}
  @Post('webhook/v1/cancel')
  @UsePipes(ValidationPipe)
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  async purchaseInvoiceCreated(@Body() purchaseReceiptPayload) {
    return await this.purchaseReceiptAggregate.purchaseReceiptCancelled(
      purchaseReceiptPayload,
    );
  }
}
