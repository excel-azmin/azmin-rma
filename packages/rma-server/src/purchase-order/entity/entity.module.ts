import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchase-order/purchase-order.entity';
import { PurchaseOrderService } from './purchase-order/purchase-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder])],
  providers: [PurchaseOrderService],
  exports: [PurchaseOrderService],
})
export class PurchaseOrderEntitiesModule {}
