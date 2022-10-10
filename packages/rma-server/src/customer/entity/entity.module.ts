import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer/customer.entity';
import { CustomerService } from './customer/customer.service';
import { Territory } from './territory/territory.entity';
import { TerritoryService } from './territory/territory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Territory])],
  providers: [CustomerService, TerritoryService],
  exports: [CustomerService, TerritoryService],
})
export class CustomerEntitiesModule {}
