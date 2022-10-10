import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ErrorLogService } from './error-log.service';
import { ErrorLog } from './error-log.entity';

describe('ErrorLog', () => {
  let service: ErrorLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorLogService,
        {
          provide: getRepositoryToken(ErrorLog),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ErrorLogService>(ErrorLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
