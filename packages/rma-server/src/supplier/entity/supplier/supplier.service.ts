import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Supplier } from './supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: MongoRepository<Supplier>,
  ) {}

  async find(query?) {
    return await this.supplierRepository.find(query);
  }

  async create(supplierPayload: Supplier) {
    const supplier = new Supplier();
    Object.assign(supplier, supplierPayload);
    return await this.supplierRepository.insertOne(supplier);
  }

  async findOne(param, options?) {
    return await this.supplierRepository.findOne(param, options);
  }

  async list(skip, take, search, sort) {
    const nameExp = new RegExp(search, 'i');
    const columns = this.supplierRepository.manager.connection
      .getMetadata(Supplier)
      .ownColumns.map(column => column.propertyName);

    const $or = columns.map(field => {
      const filter = {};
      filter[field] = nameExp;
      return filter;
    });
    const $and: any[] = [{ $or }];

    const where: { $and: any } = { $and };

    const results = await this.supplierRepository.find({
      skip,
      take,
      where,
    });

    return {
      docs: results || [],
      length: await this.supplierRepository.count(where),
      offset: skip,
    };
  }

  async deleteOne(query, options?) {
    return await this.supplierRepository.deleteOne(query, options);
  }

  async updateOne(query, options?) {
    return await this.supplierRepository.updateOne(query, options);
  }

  async count(query) {
    await this.supplierRepository.count(query);
  }
}
