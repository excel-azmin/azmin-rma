import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleGuard } from './guards/role.guard';
import { TokenGuard } from './guards/token.guard';
import { AuthControllers } from './controllers';
import { AuthAggregates } from './aggregates';
import { TokenCacheService } from './entities/token-cache/token-cache.service';
import { TokenCache } from './entities/token-cache/token-cache.entity';
import { TOKEN_CACHE_CONNECTION } from '../constants/typeorm.connection';
import { AuthSchedulers } from './schedulers';
import { CustomerEntitiesModule } from '../customer/entity/entity.module';
import { FrappeWebhookPipe } from './guards/webhook.pipe';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([TokenCache], TOKEN_CACHE_CONNECTION),
    CustomerEntitiesModule,
  ],
  providers: [
    TokenCacheService,
    RoleGuard,
    TokenGuard,
    FrappeWebhookPipe,
    ...AuthSchedulers,
    ...AuthAggregates,
  ],
  exports: [
    TokenCacheService,
    RoleGuard,
    TokenGuard,
    FrappeWebhookPipe,
    ...AuthAggregates,
  ],
  controllers: [...AuthControllers],
})
export class AuthModule {}
