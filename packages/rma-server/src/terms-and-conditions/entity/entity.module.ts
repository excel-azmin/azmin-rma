import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsAndConditions } from './terms-and-conditions/terms-and-conditions.entity';
import { TermsAndConditionsService } from './terms-and-conditions/terms-and-conditions.service';

@Module({
  imports: [TypeOrmModule.forFeature([TermsAndConditions])],
  providers: [TermsAndConditionsService],
  exports: [TermsAndConditionsService],
})
export class TermsAndConditionsEntitiesModule {}
