import { Test, TestingModule } from '@nestjs/testing';
import { SupplierAggregateService } from './supplier-aggregate.service';
import { SupplierService } from '../../entity/supplier/supplier.service';
describe('supplierAggregateService', () => {
  let service: SupplierAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierAggregateService,
        {
          provide: SupplierService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SupplierAggregateService>(SupplierAggregateService);
  });
  SupplierAggregateService;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
