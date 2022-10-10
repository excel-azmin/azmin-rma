import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TerritoryService } from './territory.service';
import { Territory } from './territory.entity';

describe('TerritoryService', () => {
  let service: TerritoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TerritoryService,
        {
          provide: getRepositoryToken(Territory),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TerritoryService>(TerritoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
