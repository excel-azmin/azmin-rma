import { InjectRepository } from '@nestjs/typeorm';
import { WarrantyClaim } from './warranty-claim.entity';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import {
  CATEGORY,
  DEFAULT_NAMING_SERIES,
} from '../../../constants/app-strings';
import { PARSE_REGEX } from '../../../constants/app-strings';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { DateTime } from 'luxon';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class WarrantyClaimService {
  constructor(
    @InjectRepository(WarrantyClaim)
    private readonly warrantyClaimRepository: MongoRepository<WarrantyClaim>,
    private readonly settings: SettingsService,
  ) {}

  async find(query?) {
    return await this.warrantyClaimRepository.find(query);
  }

  async create(warrantyClaim: WarrantyClaim) {
    if (!['Bulk', 'Part'].includes(warrantyClaim.set)) {
      warrantyClaim.claim_no = await this.generateNamingSeries(
        warrantyClaim.set,
      );
      return await this.warrantyClaimRepository.insertOne(warrantyClaim);
    }
    warrantyClaim.claim_no = warrantyClaim.uuid;
    return this.warrantyClaimRepository.insertOne(warrantyClaim);
  }

  async findOne(param, options?) {
    return await this.warrantyClaimRepository.findOne(param, options);
  }

  async list(skip, take, sort, filter_query?, territory?, clientHttpRequest?) {
    let sortQuery;
    let dateQuery = {};

    try {
      sortQuery = JSON.parse(sort);
    } catch (error) {
      sortQuery = {
        modifiedOn: 'desc',
      };
    }
    sortQuery =
      Object.keys(sortQuery).length === 0 ? { modifiedOn: 'desc' } : sortQuery;

    if (
      filter_query?.fromDate &&
      filter_query?.toDate &&
      filter_query.date_type === 'Delivery Date'
    ) {
      const date = new Date(filter_query.fromDate);
      const newDate = date.setDate(date.getDate() + 1);
      dateQuery = {
        delivery_date: {
          $gte: new Date(newDate).toISOString().split('T')[0],
          $lte: new Date(filter_query.toDate).toISOString().split('T')[0],
        },
      };
    } else if (
      filter_query?.fromDate &&
      filter_query?.toDate &&
      filter_query.date_type === 'Recieved Date'
    ) {
      dateQuery = {
        createdOn: {
          $gte: new Date(filter_query.fromDate),
          $lte: new Date(filter_query.toDate),
        },
      };
    }

    for (const key of Object.keys(sortQuery)) {
      sortQuery[key] = sortQuery[key].toUpperCase();
      if (!sortQuery[key]) {
        delete sortQuery[key];
      }
    }
    const $or: any[] = [
      {
        'status_history.transfer_branch': {
          $in: clientHttpRequest.token.territory,
        },
      },
      {
        'status_history.status_from': {
          $in: clientHttpRequest.token.territory,
        },
      },
    ];

    delete filter_query.date_type;
    const $and: any[] = [
      { $or },
      { set: { $in: territory.set } },
      filter_query ? this.getFilterQuery(filter_query) : {},
      dateQuery,
    ];

    const where: { $and: any } = { $and };

    const results = await this.warrantyClaimRepository.findAndCount({
      skip,
      take,
      where,
      order: sortQuery,
    });

    return {
      docs: results[0] || [],
      length: results[1],
      offset: skip,
    };
  }

  async report(filter_query) {
    let dateQuery = {};
    if (filter_query?.fromDate && filter_query?.toDate) {
      dateQuery = {
        createdOn: {
          $gte: new Date(new Date(filter_query.fromDate).setHours(0, 0, 0, 0)),
          $lte: new Date(
            new Date(filter_query.toDate).setHours(23, 59, 59, 59),
          ),
        },
      };
    }

    let deliveryQuery = {};
    if (filter_query?.delivery_status) {
      deliveryQuery = {
        status_history: {
          $elemMatch: { delivery_status: filter_query?.delivery_status },
        },
      };
    }

    const $or: any[] = [
      {
        'status_history.transfer_branch': {
          $in: [filter_query?.territory],
        },
      },
      {
        'status_history.status_from': {
          $in: [filter_query?.territory],
        },
      },
    ];

    const $and: any[] = [
      filter_query.territory ? { $or } : {},
      filter_query ? this.getReportFilterQuery(filter_query) : {},
      deliveryQuery,
      dateQuery,
    ];

    const where: { $and: any } = { $and };

    const results = await this.warrantyClaimRepository.findAndCount({
      where,
    });

    return {
      docs: results[0] || [],
      length: results[1],
    };
  }

  getReportFilterQuery(query) {
    const keys = Object.keys(query);
    keys.forEach(key => {
      if (query[key]) {
        if (
          key === 'fromDate' ||
          key === 'toDate' ||
          key === 'delivery_status' ||
          key === 'territory'
        ) {
          delete query[key];
        }
      } else {
        delete query[key];
      }
    });
    return query;
  }

  getFilterQuery(query) {
    const keys = Object.keys(query);
    keys.forEach(key => {
      if (query[key]) {
        if (key === 'claim_status' && query[key] === 'All') {
          delete query[key];
        } else {
          if (typeof query[key] === 'string') {
            if (['claim_type'].includes(key)) {
              return;
            }
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
    return await this.warrantyClaimRepository.deleteOne(query, options);
  }

  async deleteMany(query, options?) {
    return await this.warrantyClaimRepository.deleteMany(query, options);
  }

  async updateOne(query, options?) {
    return await this.warrantyClaimRepository.updateOne(query, options);
  }

  async updateMany(query, options?) {
    return await this.warrantyClaimRepository.updateMany(query, options);
  }

  async insertMany(query, options?) {
    return await this.warrantyClaimRepository.insertMany(query, options);
  }

  async count(query) {
    return await this.warrantyClaimRepository.count(query);
  }

  asyncAggregate(query, collation) {
    return of(this.warrantyClaimRepository.aggregate(query, collation)).pipe(
      switchMap((aggregateData: any) => {
        return aggregateData.toArray();
      }),
    );
  }

  async generateNamingSeries(type: string) {
    const settings = await this.settings.find().toPromise();
    const date = new DateTime(settings.timeZone).year;
    let sortedDocument;
    switch (type) {
      case 'Bulk':
        sortedDocument = await this.asyncAggregate(
          [
            {
              $match: {
                claim_no: { $regex: PARSE_REGEX('RMA-'), $options: 'i' },
                $expr: { $eq: [{ $year: '$createdOn' }, date] },
                set: type,
              },
            },
            { $sort: { claim_no: -1 } },
            { $limit: 1 },
          ],
          {
            collation: {
              locale: 'en_US',
              numericOrdering: true,
            },
          },
        ).toPromise();
        if (!sortedDocument.length) {
          return DEFAULT_NAMING_SERIES.bulk_warranty_claim + date + '-' + '1';
        }
        return this.generateClaimString(sortedDocument.find(x => x).claim_no);

      default:
        sortedDocument = await this.asyncAggregate(
          [
            {
              $match: {
                claim_no: { $regex: PARSE_REGEX('RMA-'), $options: 'i' },
                $expr: {
                  $and: [
                    { $eq: [{ $year: '$createdOn' }, date] },
                    { $ne: ['$claim_no', '$uuid'] },
                  ],
                },
                $or: [{ set: CATEGORY.SINGLE }, { set: CATEGORY.PART }],
              },
            },
            { $sort: { claim_no: -1 } },
            { $limit: 1 },
          ],
          {
            collation: {
              locale: 'en_US',
              numericOrdering: true,
            },
          },
        ).toPromise();
        if (!sortedDocument.length) {
          return DEFAULT_NAMING_SERIES.warranty_claim + date + '-' + '1';
        }
        return this.generateClaimString(
          sortedDocument.find(x => x).claim_no,
          date,
        );
    }
  }

  generateClaimString(claim_no, date?) {
    if (!claim_no) {
      return DEFAULT_NAMING_SERIES.warranty_claim;
    }
    claim_no = claim_no.split('-');
    claim_no[2] = parseInt(claim_no[2], 10) + 1;
    claim_no = claim_no.join('-');
    return claim_no;
  }
}
