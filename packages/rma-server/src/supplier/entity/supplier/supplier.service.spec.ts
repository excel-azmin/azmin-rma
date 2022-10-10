import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SupplierService } from './supplier.service';
import { Supplier } from './supplier.entity';

describe('SupplierService', () => {
  let service: SupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
