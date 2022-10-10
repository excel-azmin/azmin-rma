import { InjectRepository } from '@nestjs/typeorm';
import { StockEntry } from './stock-entry.entity';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { STOCK_ENTRY_LIST_ITEM_SELECT_KEYS } from '../../constants/app-strings';
import { PARSE_REGEX } from '../../constants/app-strings';
import { PermissionStateInterface } from '../../constants/agenda-job';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Injectable()
export class StockEntryService {
  constructor(
    @InjectRepository(StockEntry)
    private readonly stockEntryRepository: MongoRepository<StockEntry>,
  ) {}

  async find(query?) {
    return await this.stockEntryRepository.find(query);
  }

  async create(stockEntry: StockEntry) {
    return await this.stockEntryRepository.insertOne(stockEntry);
  }

  async findOne(param, options?) {
    return await this.stockEntryRepository.findOne(param, options);
  }

  async list(
    skip,
    take,
    sort,
    permissionState: PermissionStateInterface,
    filter_query?,
  ) {
    let sortQuery;
    const query: any = {};
    let permissionQuery: any = {
      items: {
        $elemMatch: {},
      },
    };

    try {
      sortQuery = JSON.parse(sort);
    } catch (error) {
      sortQuery = {
        _id: 'DESC',
      };
    }

    for (const key of Object.keys(sortQuery)) {
      if (!sortQuery[key]) {
        delete sortQuery[key];
      } else {
        sortQuery[key] = sortQuery[key].toUpperCase();
      }
    }

    if (filter_query.names) {
      query.names = { $regex: PARSE_REGEX(filter_query.names), $options: 'i' };
      delete filter_query.names;
    }

    if (filter_query.s_warehouse) {
      permissionQuery.items.$elemMatch.s_warehouse = {
        $in: [filter_query.s_warehouse],
      };
      delete filter_query.s_warehouse;
    }

    if (filter_query.t_warehouse) {
      permissionQuery.items.$elemMatch.t_warehouse = {
        $in: [filter_query.t_warehouse],
      };
      delete filter_query.t_warehouse;
    }

    if (permissionState.warehouses) {
      permissionQuery.items.$elemMatch.$or = [
        { t_warehouse: { $in: permissionState.warehouses } },
        { s_warehouse: { $in: permissionState.warehouses } },
      ];
    }

    if (permissionState.territories) {
      permissionQuery.territory = { $in: permissionState.territories };
    }

    if (filter_query?.fromDate && filter_query?.toDate) {
      query.createdAt = {
        $gte: new Date(filter_query.fromDate),
        $lte: new Date(filter_query.toDate),
      };
      delete filter_query.fromDate;
      delete filter_query.toDate;
    }

    if (filter_query?.warrantyClaimUuid) {
      query.warrantyClaimUuid = filter_query.warrantyClaimUuid;
      delete filter_query.warrantyClaimUuid;
    }

    if (permissionQuery?.items) {
      permissionQuery = this.getElementMatchCondition(permissionQuery);
    }

    const $and: any[] = [
      filter_query ? this.getFilterQuery(filter_query) : {},
      query,
      permissionQuery,
    ];

    const where: { $and: any } = { $and };

    const select: string[] = this.getSelectKeys();

    // this is to override the type or typeorm select, it dose not support child objects in query builder.
    const db: any = this.stockEntryRepository;

    const results = await db.find({
      skip,
      take,
      where,
      order: sortQuery,
      select,
    });

    return {
      docs: results || [],
      length: await db.count(where),
      offset: skip,
    };
  }

  getSelectKeys() {
    const select = STOCK_ENTRY_LIST_ITEM_SELECT_KEYS.map(key => `items.${key}`);
    select.push(
      ...this.stockEntryRepository.manager.connection
        .getMetadata(StockEntry)
        .ownColumns.map(column => column.propertyName),
    );
    select.splice(select.indexOf('items'), 1);
    return select;
  }

  getElementMatchCondition(query: string) {
    return {
      $or: [query, { items: { $exists: true, $eq: [] } }],
    };
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

  async deleteOne(query, options?) {
    return await this.stockEntryRepository.deleteOne(query, options);
  }

  async updateOne(query, options?) {
    return await this.stockEntryRepository.updateOne(query, options);
  }

  async insertMany(query, options?) {
    return await this.stockEntryRepository.insertMany(query, options);
  }

  asyncAggregate(query) {
    return of(this.stockEntryRepository.aggregate(query)).pipe(
      switchMap((aggregateData: any) => {
        return aggregateData.toArray();
      }),
    );
  }
}
