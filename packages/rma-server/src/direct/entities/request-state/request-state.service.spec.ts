import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestStateService } from './request-state.service';
import { RequestState } from './request-state.entity';

describe('RequestStateService', () => {
  let service: RequestStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestStateService,
        { provide: getRepositoryToken(RequestState), useValue: {} },
      ],
    }).compile();

    service = module.get<RequestStateService>(RequestStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
