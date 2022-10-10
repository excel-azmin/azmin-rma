import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { RequestState } from './request-state.entity';
import { DEFAULT } from '../../../constants/typeorm.connection';

@Injectable()
export class RequestStateService {
  constructor(
    @InjectRepository(RequestState, DEFAULT)
    private readonly requestStateRepository: MongoRepository<RequestState>,
  ) {}

  async save(params) {
    return await this.requestStateRepository.save(params);
  }

  async find(): Promise<RequestState[]> {
    return await this.requestStateRepository.find();
  }

  async findOne(params) {
    return await this.requestStateRepository.findOne(params);
  }

  async findAndModify(query, update, options?) {
    return await this.requestStateRepository.findOneAndUpdate(query, update);
  }

  async count() {
    return await this.requestStateRepository.count();
  }

  async paginate(skip: number, take: number) {
    return await this.requestStateRepository.find({ skip, take });
  }

  async deleteMany(params) {
    return await this.requestStateRepository.deleteMany(params);
  }
}
