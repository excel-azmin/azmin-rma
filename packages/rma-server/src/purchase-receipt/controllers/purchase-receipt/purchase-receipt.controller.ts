import {
  Controller,
  Post,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { PurchaseReceiptDto } from '../../entity/purchase-receipt-dto';
import { PurchaseReceiptAggregateService } from '../../aggregates/purchase-receipt-aggregate/purchase-receipt-aggregate.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  APPLICATION_JSON_CONTENT_TYPE,
  INVALID_FILE,
} from '../../../constants/app-strings';

@Controller('purchase_receipt')
export class PurchaseReceiptController {
  constructor(
    private readonly purchaseReceiptAggregateService: PurchaseReceiptAggregateService,
  ) {}

  @Post('v1/create')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() purchaseReceiptPayload: PurchaseReceiptDto,
    @UploadedFile('file') file,
    @Req() req,
  ) {
    if (file) {
      if (file.mimetype !== APPLICATION_JSON_CONTENT_TYPE) {
        throw new BadRequestException(INVALID_FILE);
      }
      return this.purchaseReceiptAggregateService.purchaseReceiptFromFile(
        file,
        req,
      );
    }
    return this.purchaseReceiptAggregateService.addPurchaseReceipt(
      purchaseReceiptPayload,
      req,
    );
  }

  @Post('v1/create_bulk')
  @UseGuards(TokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  createBulk(@UploadedFile('file') file, @Req() req) {
    if (file && file.mimetype !== APPLICATION_JSON_CONTENT_TYPE) {
      throw new BadRequestException(INVALID_FILE);
    }
    return this.purchaseReceiptAggregateService.purchaseReceiptFromFile(
      file,
      req,
    );
  }
}
