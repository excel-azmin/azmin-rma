import { Injectable } from '@nestjs/common';
import { Problem } from './problem-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

@Injectable()
export class ProblemService {
  constructor(
    @InjectRepository(Problem)
    private problemRepository: MongoRepository<Problem>,
  ) {}

  async create(problemPayload: Problem) {
    return await this.problemRepository.insertOne(problemPayload);
  }

  async findOne(param, options?) {
    return await this.problemRepository.findOne(param, options);
  }

  async deleteOne(query, param?) {
    return await this.problemRepository.deleteOne(query, param);
  }

  async updateOne(query, param) {
    return await this.problemRepository.updateOne(query, param);
  }

  async list(skip, take, search, sort) {
    const sortQuery = { problem_name: sort };

    const nameExp = new RegExp(search, 'i');

    const $or = [{ problem_name: nameExp }];

    const $and: any[] = [{ $or }];

    const where: { $and: any } = { $and };

    const results = await this.problemRepository.findAndCount({
      skip,
      take,
      where,
      order: sortQuery,
    });

    return {
      docs: results[0] || [],
      length: results[1],
      offset: skip,
    };
  }
}
