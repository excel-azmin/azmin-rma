import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseReceipt } from './purchase-receipt.entity';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { PARSE_REGEX } from '../../constants/app-strings';

@Injectable()
export class PurchaseReceiptService {
  constructor(
    @InjectRepository(PurchaseReceipt)
    private readonly purchaseReceiptRepository: MongoRepository<PurchaseReceipt>,
  ) {}

  async find(options?) {
    return await this.purchaseReceiptRepository.find(options);
  }

  async create(purchaseReceipt: PurchaseReceipt) {
    return await this.purchaseReceiptRepository.insertOne(purchaseReceipt);
  }

  async findOne(query, param?) {
    return await this.purchaseReceiptRepository.findOne(query, param);
  }

  async list(skip, take, sort, filter_query?) {
    let sortQuery;

    try {
      sortQuery = JSON.parse(sort);
    } catch (error) {
      sortQuery = { createdOn: 'desc' };
    }

    for (const key of Object.keys(sortQuery)) {
      sortQuery[key] = sortQuery[key].toUpperCase();
      if (!sortQuery[key]) {
        delete sortQuery[key];
      }
    }

    const $and: any[] = [filter_query ? this.getFilterQuery(filter_query) : {}];

    const where: { $and: any } = { $and };
    const results = await this.purchaseReceiptRepository.find({
      skip,
      take,
      where,
      order: sortQuery,
    });

    return {
      docs: results || [],
      length: await this.purchaseReceiptRepository.count(where),
      offset: skip,
    };
  }

  async deleteOne(query, param?) {
    return await this.purchaseReceiptRepository.deleteOne(query, param);
  }

  async updateOne(query, param) {
    return await this.purchaseReceiptRepository.updateOne(query, param);
  }

  async updateMany(query, options?) {
    return await this.purchaseReceiptRepository.updateMany(query, options);
  }

  getFilterQuery(query) {
    const keys = Object.keys(query);
    keys.forEach(key => {
      if (query[key]) {
        if (typeof query[key] === 'string') {
          query[key] = { $regex: PARSE_REGEX(query[key]), $options: 'i' };
        } else {
          delete query[key];
        }
      } else {
        delete query[key];
      }
    });
    return query;
  }

  async insertMany(query, options?) {
    return await this.purchaseReceiptRepository.insertMany(query, options);
  }
}
