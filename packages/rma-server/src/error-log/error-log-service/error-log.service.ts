import { InjectRepository } from '@nestjs/typeorm';
import { ErrorLog } from './error-log.entity';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PARSE_REGEX } from '../../constants/app-strings';

@Injectable()
export class ErrorLogService {
  constructor(
    @InjectRepository(ErrorLog)
    private readonly errorLogRepository: MongoRepository<ErrorLog>,
  ) {}

  async find() {
    return await this.errorLogRepository.find();
  }

  async create(errorLog: ErrorLog) {
    return await this.errorLogRepository.insertOne(errorLog);
  }

  async findOne(query, param?) {
    return await this.errorLogRepository.findOne(query, param);
  }

  async list(skip, take, sort, filter_query?) {
    let sortQuery;

    try {
      sortQuery = JSON.parse(sort);
    } catch (error) {
      sortQuery = { createdOn: 'desc' };
    }

    for (const key of Object.keys(sortQuery)) {
      sortQuery[key] = sortQuery[key].toUpperCase();
      if (!sortQuery[key]) {
        delete sortQuery[key];
      }
    }

    const $and: any[] = [filter_query ? this.getFilterQuery(filter_query) : {}];

    const where: { $and: any } = { $and };
    const results = await this.errorLogRepository.find({
      skip,
      take,
      where,
      order: sortQuery,
    });

    return {
      docs: results || [],
      length: await this.errorLogRepository.count(where),
      offset: skip,
    };
  }

  async deleteOne(query, param?) {
    return await this.errorLogRepository.deleteOne(query, param);
  }

  async updateOne(query, param) {
    return await this.errorLogRepository.updateOne(query, param);
  }

  async updateMany(query, options?) {
    return await this.errorLogRepository.updateMany(query, options);
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

  createErrorLog(
    error,
    docType = '',
    entity = '',
    req?: {
      token?: { accessToken?: string; fullName?: string; email?: string };
    },
  ) {
    let frappeError;
    const errorLog = new ErrorLog();
    errorLog.createdOn = new Date();
    errorLog.error = error;
    errorLog.uuid = uuidv4();
    try {
      frappeError = JSON.parse(error.response.data._server_messages);
      frappeError = JSON.parse(frappeError);
      frappeError = (frappeError as { message?: string }).message;
      errorLog.message = frappeError;
    } catch {}
    try {
      errorLog.docType = docType;
      errorLog.entity = entity;
      errorLog.error =
        error.response && error.response.data && error.response.data.exc
          ? error.response.data.exc
          : error;
      errorLog.url = error.config.url || '';
      errorLog.body = error.config.data || '';
      errorLog.method = error.config.method || '';
      errorLog.token =
        req && req.token && req.token.accessToken ? req.token.accessToken : '';
      errorLog.user = req.token && req.token.fullName ? req.token.fullName : '';
    } catch {
      errorLog.error =
        error.response && error.response.data && error.response.data.exc
          ? error.response.data.exc
          : error;
    }
    this.create(errorLog)
      .then(success => {})
      .catch(err => {});
  }
}
