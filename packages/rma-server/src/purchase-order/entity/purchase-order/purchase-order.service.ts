import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { PARSE_REGEX } from '../../../constants/app-strings';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: MongoRepository<PurchaseOrder>,
  ) {}

  async find(query?) {
    return await this.purchaseOrderRepository.find(query);
  }

  async create(purchaseOrder: PurchaseOrder) {
    const purchaseOrderObject = new PurchaseOrder();
    Object.assign(purchaseOrderObject, purchaseOrder);
    return await this.purchaseOrderRepository.insertOne(purchaseOrderObject);
  }

  async findOne(param, options?) {
    return await this.purchaseOrderRepository.findOne(param, options);
  }

  async list(skip, take, sort, filter_query?) {
    let sortQuery;

    try {
      sortQuery = JSON.parse(sort);
    } catch (error) {
      sortQuery = { created_on: 'desc' };
    }

    for (const key of Object.keys(sortQuery)) {
      sortQuery[key] = sortQuery[key].toUpperCase();
      if (!sortQuery[key]) {
        delete sortQuery[key];
      }
    }

    const $and: any[] = [filter_query ? this.getFilterQuery(filter_query) : {}];

    const where: { $and: any } = { $and };

    const [results, length] = await this.purchaseOrderRepository.findAndCount({
      skip,
      take,
      where,
      order: sortQuery,
    });

    return {
      docs: results || [],
      length,
      offset: skip,
    };
  }

  getFilterQuery(query) {
    const keys = Object.keys(query);
    keys.forEach(key => {
      if (query[key]) {
        if (key === 'status' && query[key] === 'All') {
          delete query[key];
        } else {
          if (typeof query[key] === 'string') {
            query[key] = { $regex: PARSE_REGEX(query[key]), $options: 'i' };
          } else {
            delete query[key];
          }
        }
      } else {
        delete query[key];
      }
    });
    return query;
  }

  async deleteOne(query, options?) {
    return await this.purchaseOrderRepository.deleteOne(query, options);
  }

  async updateOne(query, options?) {
    return await this.purchaseOrderRepository.updateOne(query, options);
  }

  async insertMany(query, options?) {
    return await this.purchaseOrderRepository.insertMany(query, options);
  }
}
