import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

import { SalesInvoiceWebhookAggregateService } from '../../aggregates/sales-invoice-webhook-aggregate/sales-invoice-webhook-aggregate.service';
import { SalesInvoiceWebhookDto } from '../../entity/sales-invoice/sales-invoice-webhook-dto';

@Controller('sales_invoice')
export class SalesInvoiceWebhookController {
  constructor(
    private readonly salesInvoiceWebhookAggregate: SalesInvoiceWebhookAggregateService,
  ) {}

  @Post('webhook/v1/create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  purchaseInvoiceCreated(
    @Body() purchaseInvoicePayload: SalesInvoiceWebhookDto,
  ) {
    if (purchaseInvoicePayload.is_return) return;

    return this.salesInvoiceWebhookAggregate.salesInvoiceCreated(
      purchaseInvoicePayload,
    );
  }

  @Post('webhook/v1/cancel')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  purchaseInvoiceCanceled(@Body() purchaseInvoicePayload: { name: string }) {
    return this.salesInvoiceWebhookAggregate.salesInvoiceCanceled(
      purchaseInvoicePayload,
    );
  }
}
