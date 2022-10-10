import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { ProblemService } from '../../entity/problem/problem.service';
import {
  CreateProblemDto,
  UpdateProblemDto,
} from '../../entity/problem/problem-dto';
import { Problem } from '../../entity/problem/problem-entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProblemAggregateService extends AggregateRoot {
  constructor(private readonly problemService: ProblemService) {
    super();
  }

  async createProblem(problemPayload: CreateProblemDto) {
    const problem = new Problem();
    Object.assign(problem, problemPayload);
    problem.uuid = uuidv4();
    return await this.problemService.create(problem);
  }

  async updateProblem(problemPayload: UpdateProblemDto) {
    const problem = await this.problemService.findOne({
      uuid: problemPayload.uuid,
    });
    Object.assign(problem, problemPayload);
    return await this.problemService.updateOne(
      { uuid: problemPayload.uuid },
      { $set: problemPayload },
    );
  }

  async list(offset, limit, search, sort) {
    if (!sort || sort === '') {
      sort = 'ASC';
    }

    if (sort !== 'ASC') {
      sort = 'DESC';
    }

    return await this.problemService.list(offset, limit, search, sort);
  }

  async getProblem(uuid: string) {
    return await this.problemService.findOne({ uuid });
  }

  async deleteProblem(uuid: string) {
    return await this.problemService.deleteOne({ uuid });
  }
}
