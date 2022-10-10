import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryNote } from './delivery-note.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class DeliveryNoteService {
  constructor(
    @InjectRepository(DeliveryNote)
    private readonly deliveryNoteRepository: MongoRepository<DeliveryNote>,
  ) {}

  async create(deliveryNotePayload) {
    const deliveryNote = new DeliveryNote();
    Object.assign(deliveryNote, deliveryNotePayload);
    return await this.deliveryNoteRepository.insertOne(deliveryNote);
  }

  async find(query?) {
    return await this.deliveryNoteRepository.find(query);
  }

  async findOne(param, options?) {
    return await this.deliveryNoteRepository.findOne(param, options);
  }

  async list(skip, take, search, sort) {
    const nameExp = new RegExp(search, 'i');
    const columns = this.deliveryNoteRepository.manager.connection
      .getMetadata(DeliveryNote)
      .ownColumns.map(column => column.propertyName);

    const $or = columns.map(field => {
      const filter = {};
      filter[field] = nameExp;
      return filter;
    });
    const $and: any[] = [{ $or }];

    const where: { $and: any } = { $and };

    const results = await this.deliveryNoteRepository.find({
      skip,
      take,
      where,
    });

    return {
      docs: results || [],
      length: await this.deliveryNoteRepository.count(where),
      offset: skip,
    };
  }

  async deleteOne(query, options?) {
    return await this.deliveryNoteRepository.deleteOne(query, options);
  }

  async deleteMany(params) {
    return await this.deliveryNoteRepository.deleteMany(params);
  }

  async updateOne(query, options?) {
    return await this.deliveryNoteRepository.updateOne(query, options);
  }

  async updateMany(query, params) {
    return await this.deliveryNoteRepository.updateMany(query, params);
  }

  async count() {
    return await this.deliveryNoteRepository.count();
  }

  async paginate(skip: number, take: number) {
    return await this.deliveryNoteRepository.find({ skip, take });
  }
}
