import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { SerialNo } from './serial-no.entity';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SERIAL_FILTER_KEYS } from '../../../constants/app-strings';

@Injectable()
export class SerialNoService {
  constructor(
    @InjectRepository(SerialNo)
    private readonly serialNoRepository: MongoRepository<SerialNo>,
  ) {}

  async find(query?) {
    return await this.serialNoRepository.find(query);
  }

  async create(serialNoPayload: SerialNo) {
    const serialNo = new SerialNo();
    Object.assign(serialNo, serialNoPayload);
    return await this.serialNoRepository.insertOne(serialNo);
  }

  async findOne(param, options?) {
    return await this.serialNoRepository.findOne(param, options);
  }

  async list(skip, take, sort, filterQuery) {
    let order: unknown;

    try {
      order = JSON.parse(sort);
    } catch (error) {
      order = { _id: -1 };
    }

    if (Object.keys(order).length === 0) {
      order = { _id: -1 };
    }

    try {
      filterQuery = JSON.parse(filterQuery);
    } catch (error) {
      filterQuery = {};
    }

    const where: { [key: string]: any } = filterQuery
      ? this.parseSerialFilterQuery(filterQuery)
      : {};
    const results = await this.serialNoRepository.findAndCount({
      skip,
      take,
      where,
      order,
    });

    return {
      docs: results[0] || [],
      length: results[1],
      offset: skip,
    };
  }

  parseSerialFilterQuery(filterQuery: { [key: string]: any }) {
    Object.keys(filterQuery).forEach(key => {
      if (!SERIAL_FILTER_KEYS.includes(key)) {
        delete filterQuery[key];
      }
      if (['item_code', 'warehouse'].includes(key) && !filterQuery[key]) {
        delete filterQuery[key];
      }
    });
    return filterQuery;
  }

  async listPurchasedSerial(purchase_invoice_name, skip, take, search = '') {
    const searchQuery: any = { purchase_invoice_name };

    if (search && search !== '') {
      searchQuery.serial_no = { $regex: search.toUpperCase() };
    }

    return {
      docs: await this.aggregateList(skip, take, searchQuery).toPromise(),
      length: await this.serialNoRepository.count(searchQuery),
      offset: skip,
    };
  }

  aggregateList(skip = 0, limit = 10, query, sort?) {
    return this.asyncAggregate([
      { $match: query },
      { $skip: skip },
      { $limit: limit },
    ]);
  }

  async listDeliveredSerial(sales_invoice_name, search, skip = 0, take = 10) {
    const serialNoQuery: any = { sales_invoice_name };

    if (search && search !== '') {
      serialNoQuery.serial_no = { $regex: search.toUpperCase() };
    }

    return {
      docs: await this.aggregateList(skip, take, serialNoQuery).toPromise(),
      length: await this.serialNoRepository.count(serialNoQuery),
      offset: skip,
    };
  }

  async listReturnInvoicesSerials(
    serial_numbers: string[],
    offset: number,
    limit: number,
  ) {
    return {
      data: await this.aggregateList(offset, limit, {
        serial_no: { $in: serial_numbers },
      }).toPromise(),
      length: await this.serialNoRepository.count({
        serial_no: { $in: serial_numbers },
      }),
      offset,
    };
  }

  async deleteOne(query, options?) {
    return await this.serialNoRepository.deleteOne(query, options);
  }

  async deleteMany(query, options?) {
    return await this.serialNoRepository.deleteMany(query, options);
  }

  async updateOne(query, options?) {
    return await this.serialNoRepository.updateOne(query, options);
  }

  async updateMany(query, options?) {
    return await this.serialNoRepository.updateMany(query, options);
  }

  async insertMany(query, options?) {
    return await this.serialNoRepository.insertMany(query, options);
  }

  asyncAggregate(query) {
    return of(this.serialNoRepository.aggregate(query)).pipe(
      switchMap((aggregateData: any) => {
        return aggregateData.toArray();
      }),
    );
  }

  async count(query) {
    return await this.serialNoRepository.count(query);
  }
}

export class AggregatePaginationResponse {
  length: { total: string }[];
  docs: any[];
}
