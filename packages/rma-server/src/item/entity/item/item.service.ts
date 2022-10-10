import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Item } from './item.entity';
import { PARSE_REGEX } from '../../../constants/app-strings';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: MongoRepository<Item>,
  ) {}

  async find(query?) {
    return await this.itemRepository.find(query);
  }

  async create(customerPayload: Item) {
    const customer = new Item();
    Object.assign(customer, customerPayload);
    return await this.itemRepository.insertOne(customer);
  }

  async findOne(param, options?) {
    return await this.itemRepository.findOne(param, options);
  }

  async list(skip, take, sort, filterQuery?) {
    let sortQuery;
    try {
      sortQuery = JSON.parse(sort);
    } catch {
      sortQuery = { name: 'asc' };
    }

    try {
      filterQuery = JSON.parse(filterQuery);
    } catch {
      filterQuery = {};
    }
    for (const key of Object.keys(sortQuery)) {
      sortQuery[key] = sortQuery[key].toUpperCase();
      if (!sortQuery[key]) {
        delete sortQuery[key];
      }
    }

    const $and: any[] = [filterQuery ? this.getFilterQuery(filterQuery) : {}];

    const where: { $and: any } = { $and };

    const results = await this.itemRepository.find({
      skip,
      take,
      where,
      order: sortQuery,
    });

    return {
      docs: results || [],
      length: await this.itemRepository.count(where),
      offset: skip,
    };
  }
  async distinct() {
    return await this.itemRepository.distinct('brand', {
      brand: { $ne: null },
    });
  }

  async deleteOne(query, options?) {
    return await this.itemRepository.deleteOne(query, options);
  }

  async updateOne(query, options?) {
    return await this.itemRepository.updateOne(query, options);
  }

  async count(query) {
    return await this.itemRepository.count(query);
  }

  getFilterQuery(query) {
    const keys = Object.keys(query);
    keys.forEach(key => {
      if (query[key]) {
        if (['bundle_items', 'is_stock_item'].includes(key)) {
          return;
        }
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
}
