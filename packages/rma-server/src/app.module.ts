import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import {
  connectTypeORM,
  connectTypeORMTokenCache,
  TOKEN_CACHE_CONNECTION,
  DEFAULT,
} from './constants/typeorm.connection';
import { ConfigService } from './config/config.service';
import { DirectModule } from './direct/direct.module';
import { CustomerModule } from './customer/customer.module';
import { ItemModule } from './item/item.module';
import { SupplierModule } from './supplier/supplier.module';
import { SerialNoModule } from './serial-no/serial-no.module';
import { SalesInvoiceModule } from './sales-invoice/sales-invoice.module';
import { WarrantyClaimModule } from './warranty-claim/warranty-claim.module';
import { DeliveryNoteEntitiesModule } from './delivery-note/entity/delivery-note-entity.module';
import { CreditNoteModule } from './credit-note/credit-note-invoice.module';
import { ReturnVoucherModule } from './return-voucher/return-voucher-invoice.module';
import { DeliveryNoteModule } from './delivery-note/delivery-note.module';
import { CommandModule } from './command/command.module';
import { PurchaseInvoiceModule } from './purchase-invoice/purchase-invoice.module';
import { PurchaseReceiptModule } from './purchase-receipt/purchase-receipt.module';
import { CommonDepModule } from './common-dep/common-dep.module';
import { ErrorLogModule } from './error-log/error-logs-invoice.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { SyncModule } from './sync/sync.module';
import { StockEntryModule } from './stock-entry/stock-entry.module';
import { ProblemModule } from './problem/problem.module';
import { SyncEntitiesModule } from './sync/entities/sync-entity.module';
import { ServiceInvoiceModule } from './service-invoice/service-invoice.module';
import { PrintModule } from './print/print-module';
import { TermsAndConditionsModule } from './terms-and-conditions/terms-and-conditions.module';
import { ReportModule } from './report/report.module';
import { StockLedgerModule } from './stock-ledger/stock-ledger.module';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CommonDepModule,
    TypeOrmModule.forRootAsync({
      name: TOKEN_CACHE_CONNECTION,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: connectTypeORMTokenCache,
    }),
    TypeOrmModule.forRootAsync({
      name: DEFAULT,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: connectTypeORM,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 60 * 60 * 24 * 30,
      no_ready_check: true,
    }),
    ConfigModule,
    AuthModule,
    PrintModule,
    SystemSettingsModule,
    DirectModule,
    SyncModule,
    CommandModule,
    CustomerModule,
    DeliveryNoteEntitiesModule,
    ReturnVoucherModule,
    StockEntryModule,
    ErrorLogModule,
    PurchaseReceiptModule,
    PurchaseInvoiceModule,
    SyncEntitiesModule,
    SupplierModule,
    CreditNoteModule,
    SalesInvoiceModule,
    ItemModule,
    SerialNoModule,
    WarrantyClaimModule,
    DeliveryNoteModule,
    PurchaseOrderModule,
    ProblemModule,
    ServiceInvoiceModule,
    TermsAndConditionsModule,
    ReportModule,
    StockLedgerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
