import { Module } from '@nestjs/common';
import { ProblemController } from './controllers/problem/problem.controller';
import { ProblemEntitiesModule } from './entity/entity.module';
import { ProblemAggregatesManager } from './aggregates';

@Module({
  controllers: [ProblemController],
  imports: [ProblemEntitiesModule],
  providers: [...ProblemAggregatesManager],
  exports: [ProblemEntitiesModule],
})
export class ProblemModule {}
