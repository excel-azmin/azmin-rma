import { Module } from '@nestjs/common';
import { ReturnVoucherController } from './controller/return-voucher.controller';
import { ReturnVoucherService } from './return-voucher-service/return-voucher.service';
@Module({
  controllers: [ReturnVoucherController],
  providers: [ReturnVoucherService],
})
export class ReturnVoucherModule {}
