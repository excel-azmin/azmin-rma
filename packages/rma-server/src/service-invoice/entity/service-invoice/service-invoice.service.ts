import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInvoice } from './service-invoice.entity';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PARSE_REGEX } from '../../../constants/app-strings';

@Injectable()
export class ServiceInvoiceService {
  constructor(
    @InjectRepository(ServiceInvoice)
    private readonly serviceInvoiceRepository: MongoRepository<ServiceInvoice>,
  ) {}

  getFilterQuery(query) {
    const keys = Object.keys(query);
    keys.forEach(key => {
      if (query[key]) {
        if (['fromDate', 'toDate'].includes(key)) {
          delete query[key];
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

  async find(query?) {
    return await this.serviceInvoiceRepository.find(query);
  }

  async create(serviceInvoice: ServiceInvoice) {
    const serviceInvoiceObject = new ServiceInvoice();
    Object.assign(serviceInvoiceObject, serviceInvoice);
    return await this.serviceInvoiceRepository.insertOne(serviceInvoiceObject);
  }

  async findOne(param, options?) {
    return await this.serviceInvoiceRepository.findOne(param, options);
  }

  async list(skip, take, search, sort) {
    let dateQuery = {};
    let service_vouchers = {};
    let sortQuery;
    try {
      sortQuery = JSON.parse(sort);
    } catch {
      sortQuery = { creation: 'desc' };
    }

    for (const key of Object.keys(sortQuery)) {
      sortQuery[key] = sortQuery[key].toUpperCase();
      if (!sortQuery[key]) {
        delete sortQuery[key];
      }
    }
    try {
      search = JSON.parse(search);
    } catch {
      search = {};
    }
    if (search?.fromDate && search?.toDate) {
      dateQuery = {
        creation: {
          $gte: search.fromDate,
          $lte: search.toDate,
        },
      };
    }

    if (search.service_vouchers) {
      service_vouchers = search.service_vouchers;
      service_vouchers = {
        ...search.service_vouchers,
        docstatus: search.service_vouchers.docstatus,
      };
    }

    const $and: any[] = [
      search ? this.getFilterQuery(search) : {},
      dateQuery,
      service_vouchers,
    ];

    const where: { $and: any } = { $and };

    const results = await this.serviceInvoiceRepository.find({
      skip,
      take,
      where,
      order: sortQuery,
    });

    return {
      docs: results || [],
      length: await this.serviceInvoiceRepository.count(where),
      offset: skip,
    };
  }

  async deleteOne(query, options?) {
    return await this.serviceInvoiceRepository.deleteOne(query, options);
  }

  async updateOne(query, options?) {
    return await this.serviceInvoiceRepository.updateOne(query, options);
  }

  asyncAggregate(query) {
    return of(this.serviceInvoiceRepository.aggregate(query)).pipe(
      switchMap((aggregateData: any) => {
        return aggregateData.toArray();
      }),
    );
  }
}
