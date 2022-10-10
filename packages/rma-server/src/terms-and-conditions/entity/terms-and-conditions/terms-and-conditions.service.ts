import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { TermsAndConditions } from './terms-and-conditions.entity';

@Injectable()
export class TermsAndConditionsService {
  constructor(
    @InjectRepository(TermsAndConditions)
    private termsAndConditionsRepository: MongoRepository<TermsAndConditions>,
  ) {}

  async create(termsAndConditionsPayload: TermsAndConditions) {
    return await this.termsAndConditionsRepository.insertOne(
      termsAndConditionsPayload,
    );
  }

  async findOne(param, options?) {
    return await this.termsAndConditionsRepository.findOne(param, options);
  }

  async deleteOne(query, param?) {
    return await this.termsAndConditionsRepository.deleteOne(query, param);
  }

  async updateOne(query, param) {
    return await this.termsAndConditionsRepository.updateOne(query, param);
  }

  async list(skip, take, search, sort) {
    const sortQuery = { terms_and_conditions: sort };

    const nameExp = new RegExp(search, 'i');

    const $or = [{ terms_and_conditions: nameExp }];

    const $and: any[] = [{ $or }];

    const where: { $and: any } = { $and };

    const results = await this.termsAndConditionsRepository.findAndCount({
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
