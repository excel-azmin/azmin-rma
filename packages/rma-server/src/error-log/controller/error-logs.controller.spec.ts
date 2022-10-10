import { Test, TestingModule } from '@nestjs/testing';
import { TokenGuard } from '../../auth/guards/token.guard';
import { ErrorLogController } from './error-logs.controller';
import { ErrorLogService } from '../error-log-service/error-log.service';
import { RoleGuard } from '../../auth/guards/role.guard';

describe('ErrorLog Controller', () => {
  let controller: ErrorLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErrorLogController],
      providers: [
        {
          provide: ErrorLogService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();

    controller = module.get<ErrorLogController>(ErrorLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
