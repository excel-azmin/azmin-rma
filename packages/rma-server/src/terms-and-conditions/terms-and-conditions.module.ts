import { Module } from '@nestjs/common';
import { TermsAndConditionsAggregateService } from './aggregates/terms-and-conditions-aggregate/terms-and-conditions-aggregate.service';
import { TermsAndConditionsController } from './controllers/terms-and-conditions/terms-and-conditions.controller';
import { TermsAndConditionsEntitiesModule } from './entity/entity.module';

@Module({
  providers: [TermsAndConditionsAggregateService],
  controllers: [TermsAndConditionsController],
  imports: [TermsAndConditionsEntitiesModule],
})
export class TermsAndConditionsModule {}
