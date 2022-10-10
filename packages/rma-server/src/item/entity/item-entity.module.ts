import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemService } from './item/item.service';
import { Item } from './item/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemEntitiesModule {}
