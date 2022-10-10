import { Module } from '@nestjs/common';
import { ProblemService } from './problem/problem.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './problem/problem-entity';

@Module({
  imports: [TypeOrmModule.forFeature([Problem])],
  providers: [ProblemService],
  exports: [ProblemService],
})
export class ProblemEntitiesModule {}
