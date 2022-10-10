import { InjectRepository } from '@nestjs/typeorm';
import { SalesInvoice } from './sales-invoice.entity';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ALL_TERRITORIES } from '../../../constants/app-strings';

@Injectable()
export class SalesInvoiceService {
  constructor(
    @InjectRepository(SalesInvoice)
    private readonly salesInvoiceRepository: MongoRepository<SalesInvoice>,
  ) {}

  async find() {
    return await this.salesInvoiceRepository.find();
  }

  async create(salesInvoice: SalesInvoice) {
    return await this.salesInvoiceRepository.insertOne(salesInvoice);
  }

  async findOne(query, param?, flag = false) {
    const select: any[] = this.getColumns();
    flag ? select.splice(select.indexOf('delivery_note_items'), 1) : select;
    return await this.salesInvoiceRepository.findOne({
      select,
      where: query,
    });
  }

  async list(skip, take, sort, filter_query, territories: string[]) {
    let sortQuery;
    let dateQuery = {};
    try {
      sortQuery = JSON.parse(sort);
    } catch (error) {
      sortQuery = { 'timeStamp.created_on': 'desc' };
    }
    sortQuery =
      Object.keys(sortQuery).length === 0
        ? { 'timeStamp.created_on': 'desc' }
        : sortQuery;
    for (const key of Object.keys(sortQuery)) {
      sortQuery[key] = sortQuery[key].toUpperCase();
      if (sortQuery[key] === 'ASC') {
        sortQuery[key] = 1;
      }
      if (sortQuery[key] === 'DESC') {
        sortQuery[key] = -1;
      }
      if (!sortQuery[key]) {
        delete sortQuery[key];
      }
    }

    if (filter_query?.fromDate && filter_query?.toDate) {
      dateQuery = {
        'timeStamp.created_on': {
          $gte: new Date(filter_query.fromDate),
          $lte: new Date(filter_query.toDate),
        },
      };
    }

    const salesTeamQuery = filter_query.sales_team
      ? {
          sales_team: { $elemMatch: { sales_person: filter_query.sales_team } },
        }
      : {};

    const customerQuery =
      territories?.length !== 0 && !territories?.includes(ALL_TERRITORIES)
        ? { territory: { $in: territories } }
        : {};

    const $and: any[] = [
      filter_query ? this.getFilterQuery(filter_query) : {},
      dateQuery,
      salesTeamQuery,
      customerQuery,
    ];

    const $group = this.getKeys();

    const where: { $and: any } = { $and };

    const results = await this.aggregateList(
      skip,
      take,
      where,
      sortQuery,
      $group,
    ).toPromise();

    return {
      docs: results || [],
      length: await this.salesInvoiceRepository.count(where),
      offset: skip,
    };
  }

  aggregateList($skip = 0, $limit = 10, $match, $sort, $group) {
    return this.asyncAggregate(
      [
        { $match },
        {
          $unwind: {
            path: '$delivery_note_items',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $group },
        { $sort },
        { $skip },
        { $limit },
      ],
      {
        allowDiskUse: true,
      },
    );
  }

  async deleteOne(query, param?) {
    return await this.salesInvoiceRepository.deleteOne(query, param);
  }

  async updateOne(query, param) {
    return await this.salesInvoiceRepository.updateOne(query, param);
  }

  async updateOneWithOptions(query, param, options?) {
    return await this.salesInvoiceRepository.updateOne(query, param, options);
  }

  async updateMany(query, options?) {
    return await this.salesInvoiceRepository.updateMany(query, options);
  }

  getFilterQuery(query) {
    const keys = Object.keys(query);
    keys.forEach(key => {
      if (typeof query[key] !== 'undefined') {
        if (key === 'status' && query[key] === 'All') {
          delete query[key];
        } else if (key === 'isCampaign' && query[key] === true) {
          query[key] = true;
        } else if (key === 'territory' && !query[key]) {
          delete query[key];
        } else if (key === 'sales_team') {
          delete query[key];
        } else if (key === 'isCampaign' && query[key] === false) {
          query[key] = false;
        } else if (key === 'fromDate' || key === 'toDate') {
          delete query[key];
        } else {
          query[key] = { $regex: query[key], $options: 'i' };
        }
      } else {
        delete query[key];
      }
    });
    return query;
  }

  asyncAggregate(query, options?) {
    return of(this.salesInvoiceRepository.aggregate(query, options)).pipe(
      switchMap((aggregateData: any) => {
        return aggregateData.toArray();
      }),
    );
  }

  async count(query) {
    return await this.salesInvoiceRepository.count(query);
  }

  async findAndModify(query, params) {
    return await this.salesInvoiceRepository.findOneAndUpdate(query, params, {
      sort: { 'timeStamp.created_no': 1 },
    });
  }

  getKeys() {
    const group: any = {};
    const keys = this.getColumns();
    keys.splice(keys.indexOf('_id'), 1);
    keys.splice(keys.indexOf('delivery_note_items'), 1);

    group._id = '$' + '_id';
    group.delivered_by = { $addToSet: '$delivery_note_items.deliveredBy' };
    keys.forEach(key => {
      group[key] = {
        $first: '$' + key,
      };
    });
    return group;
  }

  getColumns() {
    return this.salesInvoiceRepository.manager.connection
      .getMetadata(SalesInvoice)
      .ownColumns.map(column => column.propertyName);
  }
}
