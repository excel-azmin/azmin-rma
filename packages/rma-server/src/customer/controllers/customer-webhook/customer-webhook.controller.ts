import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CustomerWebhookDto } from '../../entity/customer/customer-webhook-interface';
import { CustomerWebhookAggregateService } from '../../aggregates/customer-webhook-aggregate/customer-webhook-aggregate.service';
import { FrappeWebhookGuard } from '../../../auth/guards/frappe-webhook.guard';
import { FrappeWebhookPipe } from '../../../auth/guards/webhook.pipe';

@Controller('customer')
export class CustomerWebhookController {
  constructor(
    private readonly customerWebhookAggregate: CustomerWebhookAggregateService,
  ) {}

  @Post('webhook/v1/create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  customerCreated(@Body() customerPayload: CustomerWebhookDto) {
    return this.customerWebhookAggregate.customerCreated(customerPayload);
  }

  @Post('webhook/v1/update')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  customerUpdated(@Body() customerPayload: CustomerWebhookDto) {
    return this.customerWebhookAggregate.customerUpdated(customerPayload);
  }

  @Post('webhook/v1/delete')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(FrappeWebhookGuard, FrappeWebhookPipe)
  customerDeleted(@Body() customerPayload: CustomerWebhookDto) {
    return this.customerWebhookAggregate.customerDeleted(customerPayload);
  }
}
