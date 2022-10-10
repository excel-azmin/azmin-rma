import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, getConnectionToken } from '@nestjs/typeorm';
import { ServerSettings } from './server-settings.entity';
import { ServerSettingsService } from './server-settings.service';
import {
  DEFAULT,
  TOKEN_CACHE_CONNECTION,
} from '../../../constants/typeorm.connection';

describe('ServerSettingsService', () => {
  let service: ServerSettingsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerSettingsService,
        {
          provide: getRepositoryToken(ServerSettings),
          useValue: {}, // provide mock values
        },
        {
          provide: getConnectionToken(DEFAULT),
          useValue: {},
        },
        {
          provide: getConnectionToken(TOKEN_CACHE_CONNECTION),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<ServerSettingsService>(ServerSettingsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
