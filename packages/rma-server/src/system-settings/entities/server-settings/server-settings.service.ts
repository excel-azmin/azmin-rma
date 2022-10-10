import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { MongoRepository, Connection } from 'typeorm';
import { ServerSettings } from './server-settings.entity';
import { settingsAlreadyExists } from '../../../constants/exceptions';
import {
  DEFAULT,
  TOKEN_CACHE_CONNECTION,
} from '../../../constants/typeorm.connection';

@Injectable()
export class ServerSettingsService {
  constructor(
    @InjectRepository(ServerSettings, DEFAULT)
    private readonly idpSettingsRepository: MongoRepository<ServerSettings>,
    @InjectConnection(DEFAULT)
    private readonly defaultConnection: Connection,
    @InjectConnection(TOKEN_CACHE_CONNECTION)
    private readonly cacheConnection: Connection,
  ) {}

  async save(params) {
    let serverSettings = new ServerSettings();
    if (params.uuid) {
      const exists: number = await this.count();
      serverSettings = await this.findOne({ uuid: params.uuid });
      serverSettings.appURL = params.appURL;
      if (exists > 0 && !serverSettings) {
        throw settingsAlreadyExists;
      }
      serverSettings.save();
    } else {
      Object.assign(serverSettings, params);
    }
    return await this.idpSettingsRepository.save(serverSettings);
  }

  async find(): Promise<ServerSettings> {
    const settings = await this.idpSettingsRepository.find();
    return settings.length ? settings[0] : null;
  }

  async findOne(params) {
    return await this.idpSettingsRepository.findOne(params);
  }

  async updateOne(query, params) {
    return await this.idpSettingsRepository.updateOne(query, params);
  }

  async updateMany(query, params) {
    return await this.idpSettingsRepository.updateMany(query, params);
  }

  async count() {
    return this.idpSettingsRepository.count();
  }

  getCacheConnection() {
    return this.cacheConnection;
  }

  getDefaultConnection() {
    return this.defaultConnection;
  }
}
