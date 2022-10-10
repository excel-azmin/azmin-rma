import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Customer } from './customer.entity';
import { PARSE_REGEX } from '../../../constants/app-strings';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: MongoRepository<Customer>,
  ) {}

  async find(query?) {
    return await this.customerRepository.find(query);
  }

  async create(customerPayload: Customer) {
    const customer = new Customer();
    Object.assign(customer, customerPayload);
    return await this.customerRepository.insertOne(customer);
  }

  async findOne(param, options?) {
    return await this.customerRepository.findOne(param, options);
  }

  async list(skip, take, search, sort, territories: string[]) {
    const sortQuery = { name: sort };
    const nameExp = { $regex: PARSE_REGEX(search), $options: 'i' };
    const columns = this.customerRepository.manager.connection
      .getMetadata(Customer)
      .ownColumns.map(column => column.propertyName);

    const $or = columns.map(field => {
      const filter = {};
      filter[field] = nameExp;
      return filter;
    });
    const customerQuery =
      territories && territories.length !== 0
        ? { territory: { $in: territories } }
        : {};

    const $and: any[] = [{ $or }, customerQuery];

    const where: { $and: any } = { $and };

    const results = await this.customerRepository.find({
      skip,
      take,
      where,
      order: sortQuery,
    });

    return {
      docs: results || [],
      length: await this.customerRepository.count(where),
      offset: skip,
    };
  }

  async deleteOne(query, options?) {
    return await this.customerRepository.deleteOne(query, options);
  }

  async updateOne(query, options?) {
    return await this.customerRepository.updateOne(query, options);
  }
}
