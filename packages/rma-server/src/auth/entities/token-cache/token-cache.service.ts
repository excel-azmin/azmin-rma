import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { TokenCache } from './token-cache.entity';
import { TOKEN_CACHE_CONNECTION } from '../../../constants/typeorm.connection';

@Injectable()
export class TokenCacheService {
  constructor(
    @InjectRepository(TokenCache, TOKEN_CACHE_CONNECTION)
    private readonly tokenCacheRepository: MongoRepository<TokenCache>,
  ) {}

  async save(params) {
    return await this.tokenCacheRepository.save(params);
  }

  async find(): Promise<TokenCache[]> {
    return await this.tokenCacheRepository.find();
  }

  async findOne(params) {
    return await this.tokenCacheRepository.findOne(params);
  }

  async updateMany(query, params) {
    return await this.tokenCacheRepository.updateMany(query, params);
  }

  async updateOne(query, params) {
    return await this.tokenCacheRepository.updateOne(query, params);
  }

  async count() {
    return await this.tokenCacheRepository.count();
  }

  async paginate(skip: number, take: number) {
    return await this.tokenCacheRepository.find({ skip, take });
  }

  async deleteMany(params) {
    return await this.tokenCacheRepository.deleteMany(params);
  }
}
